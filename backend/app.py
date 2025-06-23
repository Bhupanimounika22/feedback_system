from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from fpdf import FPDF
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# More specific CORS configuration to allow requests from the frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Database Configuration - Updated for local development
# IMPORTANT: Replace "YOUR_ROOT_PASSWORD" with your actual MySQL root password
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost:3307/employee_feedback')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Database Models ---

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)  # In a real app, hash this!
    role = db.Column(db.String(20), nullable=False, default='Employee') # Manager or Employee

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    strengths = db.Column(db.Text, nullable=False)
    improvements = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False) # positive, neutral, negative
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_id = db.Column(db.Integer, db.ForeignKey('feedback.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    is_markdown = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

class Acknowledgement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_id = db.Column(db.Integer, db.ForeignKey('feedback.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())

class FeedbackRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    target_manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, approved, declined
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    is_anonymous = db.Column(db.Boolean, default=False)

class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_id = db.Column(db.Integer, db.ForeignKey('feedback.id'), nullable=False)
    tag_name = db.Column(db.String(50), nullable=False)


# --- API Routes ---

@app.route('/')
def index():
    return "<h1>Employee Feedback API</h1>"

# Placeholder for login
@app.route('/api/login', methods=['POST'])
def login():
    # This is a dummy login. In a real app, you'd verify a username/password
    # and return a token.
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # In a real app, you'd look up the user by email and check their password
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Dummy token
        return jsonify({"token": f"dummy-token-for-{user.role}", "role": user.role, "user": {"name": user.name, "id": user.id}})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Employee')

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email address already in use"}), 409

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(name=name, email=email, password=hashed_password, role=role)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # In a real app, you would log the error `e`
        return jsonify({"error": "An internal error occurred"}), 500
    finally:
        db.session.close()

    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/users', methods=['GET'])
def get_users():
    role = request.args.get('role')
    query = User.query
    if role:
        query = query.filter(User.role == role)
    users = query.all()
    return jsonify([
        {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
        for user in users
    ])

@app.route('/api/team', methods=['POST'])
def add_team_member():
    data = request.json
    manager_id = data.get('manager_id')
    employee_id = data.get('employee_id')

    if not manager_id or not employee_id:
        return jsonify({"error": "Manager ID and Employee ID are required"}), 400

    existing = Team.query.filter_by(manager_id=manager_id, employee_id=employee_id).first()
    if existing:
        return jsonify({"error": "This team member relationship already exists"}), 409

    new_team_member = Team(manager_id=manager_id, employee_id=employee_id)
    db.session.add(new_team_member)
    db.session.commit()
    return jsonify({"message": "Team member added successfully", "id": new_team_member.id}), 201

@app.route('/api/team', methods=['DELETE'])
def remove_team_member():
    data = request.json
    manager_id = data.get('manager_id')
    employee_id = data.get('employee_id')

    if not manager_id or not employee_id:
        return jsonify({"error": "Manager ID and Employee ID are required"}), 400

    team_member = Team.query.filter_by(manager_id=manager_id, employee_id=employee_id).first()
    if not team_member:
        return jsonify({"error": "Team member relationship not found"}), 404

    db.session.delete(team_member)
    db.session.commit()
    return jsonify({"message": "Team member removed successfully"}), 200

@app.route('/api/team/<manager_id>', methods=['GET'])
def get_team(manager_id):
    team_members = User.query.join(Team, User.id == Team.employee_id).filter(Team.manager_id == manager_id).all()
    return jsonify([{"id": user.id, "name": user.name, "email": user.email} for user in team_members])

@app.route('/api/team/members/<manager_id>', methods=['GET'])
def get_team_members(manager_id):
    # Subquery to get IDs of employees already in the manager's team
    subquery = db.session.query(Team.employee_id).filter(Team.manager_id == manager_id).subquery()
    
    # Query for users who are not in the subquery (i.e., not on the team) and are not managers
    available_employees = User.query.filter(
        User.id.notin_(subquery),
        User.role != 'Manager'
    ).all()
    
    return jsonify([
        {"id": user.id, "name": user.name, "email": user.email}
        for user in available_employees
    ])

@app.route('/api/feedback/employee/<employee_id>', methods=['GET'])
def get_employee_feedback(employee_id):
    feedback_with_managers = db.session.query(
        Feedback,
        User.name.label('manager_name')
    ).join(
        User, Feedback.manager_id == User.id
    ).filter(
        Feedback.employee_id == employee_id
    ).order_by(
        Feedback.timestamp.desc()
    ).all()

    acknowledged_ids = {ack.feedback_id for ack in Acknowledgement.query.filter_by(employee_id=employee_id).all()}

    return jsonify([
        {
            "id": feedback.id,
            "manager_id": feedback.manager_id,
            "manager_name": manager_name,
            "strengths": feedback.strengths,
            "improvements": feedback.improvements,
            "sentiment": feedback.sentiment,
            "timestamp": feedback.timestamp,
            "acknowledged": feedback.id in acknowledged_ids
        } for feedback, manager_name in feedback_with_managers
    ])

@app.route('/api/feedback/<feedback_id>', methods=['GET'])
def get_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404
    
    employee = User.query.get(feedback.employee_id)
    manager = User.query.get(feedback.manager_id)
    
    return jsonify({
        "id": feedback.id,
        "employee_id": feedback.employee_id,
        "manager_id": feedback.manager_id,
        "strengths": feedback.strengths,
        "improvements": feedback.improvements,
        "sentiment": feedback.sentiment,
        "timestamp": feedback.timestamp,
        "employee": {"name": employee.name, "email": employee.email},
        "manager": {"name": manager.name, "email": manager.email}
    })

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    new_feedback = Feedback(
        employee_id=data['employee_id'],
        manager_id=data['manager_id'],
        strengths=data['strengths'],
        improvements=data['improvements'],
        sentiment=data['sentiment']
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted successfully", "id": new_feedback.id}), 201

@app.route('/api/feedback/<feedback_id>', methods=['PUT'])
def edit_feedback(feedback_id):
    data = request.json
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        feedback.strengths = data.get('strengths', feedback.strengths)
        feedback.improvements = data.get('improvements', feedback.improvements)
        feedback.sentiment = data.get('sentiment', feedback.sentiment)
        db.session.commit()
        return jsonify({"message": "Feedback updated successfully"})
    return jsonify({"error": "Feedback not found"}), 404

@app.route('/api/feedback/<feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        db.session.delete(feedback)
        db.session.commit()
        return jsonify({"message": "Feedback deleted successfully"})
    return jsonify({"error": "Feedback not found"}), 404

@app.route('/api/feedback/request', methods=['POST'])
def request_feedback():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON in request body or Content-Type header not set to application/json"}), 400
    
    requester_id = data.get('requester_id')
    target_manager_id = data.get('target_manager_id')
    message = data.get('message')
    is_anonymous = data.get('is_anonymous', False)

    if not requester_id or not target_manager_id:
        return jsonify({"error": "Requester and target manager IDs are required"}), 400

    new_request = FeedbackRequest(
        requester_id=requester_id,
        target_manager_id=target_manager_id,
        message=message,
        is_anonymous=is_anonymous
    )
    
    try:
        db.session.add(new_request)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # In a real app, you would log the error `e`
        return jsonify({"error": "An internal error occurred while sending the request"}), 500
    finally:
        db.session.close()

    return jsonify({"message": "Feedback request sent successfully"}), 201

@app.route('/api/feedback/acknowledge', methods=['POST'])
def acknowledge_feedback():
    data = request.json
    new_acknowledgement = Acknowledgement(
        feedback_id=data['feedback_id'],
        employee_id=data['employee_id']
    )
    db.session.add(new_acknowledgement)
    db.session.commit()
    return jsonify({"message": "Feedback acknowledged"}), 201

@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    new_comment = Comment(
        feedback_id=data['feedback_id'],
        user_id=data['user_id'],
        text=data['text']
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added"}), 201

@app.route('/api/comments/<feedback_id>', methods=['GET'])
def get_comments(feedback_id):
    comments_with_users = db.session.query(
        Comment,
        User.name.label('user_name')
    ).join(
        User, Comment.user_id == User.id
    ).filter(
        Comment.feedback_id == feedback_id
    ).order_by(
        Comment.timestamp.asc()
    ).all()

    return jsonify([
        {
            "id": comment.id,
            "user_id": comment.user_id,
            "user_name": user_name,
            "text": comment.text,
            "is_markdown": comment.is_markdown,
            "timestamp": comment.timestamp
        } for comment, user_name in comments_with_users
    ])

@app.route('/api/feedback/request/<int:request_id>', methods=['PUT'])
def update_feedback_request_status(request_id):
    data = request.json
    new_status = data.get('status')

    if not new_status or new_status not in ['approved', 'declined']:
        return jsonify({"error": "Invalid status"}), 400

    feedback_request = FeedbackRequest.query.get(request_id)
    if not feedback_request:
        return jsonify({"error": "Feedback request not found"}), 404

    feedback_request.status = new_status
    db.session.commit()

    return jsonify({"message": f"Feedback request {request_id} has been {new_status}"}), 200

@app.route('/api/feedback/requests/<user_id>', methods=['GET'])
def get_feedback_requests(user_id):
    # Get requests where user is the target manager
    # Join with User table to get requester's name
    requests_with_requester = db.session.query(
        FeedbackRequest,
        User.name.label('requester_name')
    ).join(
        User, FeedbackRequest.requester_id == User.id
    ).filter(
        FeedbackRequest.target_manager_id == user_id
    ).order_by(
        FeedbackRequest.timestamp.desc()
    ).all()

    return jsonify([{
        "id": req.FeedbackRequest.id,
        "requester_id": req.FeedbackRequest.requester_id,
        "requester_name": req.requester_name if not req.FeedbackRequest.is_anonymous else "Anonymous",
        "target_manager_id": req.FeedbackRequest.target_manager_id,
        "message": req.FeedbackRequest.message,
        "status": req.FeedbackRequest.status,
        "timestamp": req.FeedbackRequest.timestamp.isoformat(),
        "is_anonymous": req.FeedbackRequest.is_anonymous
    } for req in requests_with_requester])

@app.route('/api/feedback/acknowledgements/<feedback_id>', methods=['GET'])
def get_acknowledgements(feedback_id):
    acknowledgements = Acknowledgement.query.filter_by(feedback_id=feedback_id).all()
    return jsonify([
        {
            "id": a.id,
            "employee_id": a.employee_id,
            "timestamp": a.timestamp
        } for a in acknowledgements
    ])

@app.route('/api/feedback/tags/<feedback_id>', methods=['GET'])
def get_feedback_tags(feedback_id):
    tags = Tag.query.filter_by(feedback_id=feedback_id).all()
    return jsonify([{"id": t.id, "tag_name": t.tag_name} for t in tags])

@app.route('/api/feedback/tags', methods=['POST'])
def add_feedback_tag():
    data = request.json
    new_tag = Tag(
        feedback_id=data['feedback_id'],
        tag_name=data['tag_name']
    )
    db.session.add(new_tag)
    db.session.commit()
    return jsonify({"message": "Tag added successfully"}), 201

@app.route('/api/feedback/tags/<tag_id>', methods=['DELETE'])
def delete_feedback_tag(tag_id):
    tag = Tag.query.get(tag_id)
    if tag:
        db.session.delete(tag)
        db.session.commit()
        return jsonify({"message": "Tag deleted successfully"})
    return jsonify({"error": "Tag not found"}), 404

@app.route('/api/feedback/stats/<manager_id>', methods=['GET'])
def get_manager_stats(manager_id):
    # Get feedback statistics for a manager
    total_feedback = Feedback.query.filter_by(manager_id=manager_id).count()
    positive_feedback = Feedback.query.filter_by(manager_id=manager_id, sentiment='positive').count()
    neutral_feedback = Feedback.query.filter_by(manager_id=manager_id, sentiment='neutral').count()
    negative_feedback = Feedback.query.filter_by(manager_id=manager_id, sentiment='negative').count()
    
    return jsonify({
        "total_feedback": total_feedback,
        "positive_feedback": positive_feedback,
        "neutral_feedback": neutral_feedback,
        "negative_feedback": negative_feedback,
        "sentiment_distribution": {
            "positive": positive_feedback,
            "neutral": neutral_feedback,
            "negative": negative_feedback
        }
    })

@app.route('/api/feedback/requests/employee/<employee_id>', methods=['GET'])
def get_employee_feedback_requests(employee_id):
    # Get requests where user is the requester (employee)
    requests_with_manager = db.session.query(
        FeedbackRequest,
        User.name.label('manager_name')
    ).join(
        User, FeedbackRequest.target_manager_id == User.id
    ).filter(
        FeedbackRequest.requester_id == employee_id
    ).order_by(
        FeedbackRequest.timestamp.desc()
    ).all()

    return jsonify([{
        "id": req.FeedbackRequest.id,
        "target_manager_id": req.FeedbackRequest.target_manager_id,
        "manager_name": req.manager_name,
        "message": req.FeedbackRequest.message,
        "status": req.FeedbackRequest.status,
        "timestamp": req.FeedbackRequest.timestamp.isoformat(),
        "is_anonymous": req.FeedbackRequest.is_anonymous
    } for req in requests_with_manager])

@app.route('/api/feedback/employee/stats/<employee_id>', methods=['GET'])
def get_employee_stats(employee_id):
    # Get feedback statistics for an employee
    total_feedback = Feedback.query.filter_by(employee_id=employee_id).count()
    acknowledged_feedback = Acknowledgement.query.filter_by(employee_id=employee_id).count()
    acknowledgement_rate = 0
    if total_feedback > 0:
        acknowledgement_rate = round((acknowledged_feedback / total_feedback) * 100, 2)
    return jsonify({
        "total_feedback": total_feedback,
        "acknowledged_feedback": acknowledged_feedback,
        "pending_acknowledgement": total_feedback - acknowledged_feedback,
        "acknowledgement_rate": acknowledgement_rate
    })

@app.route('/api/feedback/export/<feedback_id>', methods=['GET'])
def export_feedback_pdf(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({"error": "Feedback not found"}), 404

    employee = User.query.get(feedback.employee_id)
    manager = User.query.get(feedback.manager_id)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Feedback Report", ln=True, align='C')
    pdf.ln(10)

    pdf.cell(200, 10, txt=f"Employee: {employee.name}", ln=True)
    pdf.cell(200, 10, txt=f"Manager: {manager.name}", ln=True)
    pdf.cell(200, 10, txt=f"Date: {feedback.timestamp.strftime('%Y-%m-%d')}", ln=True)
    pdf.ln(10)

    pdf.set_font("Arial", 'B', size=12)
    pdf.cell(200, 10, txt="Strengths", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=feedback.strengths)
    pdf.ln(5)

    pdf.set_font("Arial", 'B', size=12)
    pdf.cell(200, 10, txt="Areas for Improvement", ln=True)
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, txt=feedback.improvements)
    pdf.ln(10)

    # Create response
    response = make_response(pdf.output(dest='S').encode('latin-1'))
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=feedback_{feedback_id}.pdf'

    return response

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    })

@app.route('/api/feedback/manager/<manager_id>', methods=['GET'])
def get_manager_feedback(manager_id):
    feedback_with_employees = db.session.query(
        Feedback,
        User.name.label('employee_name')
    ).join(
        User, Feedback.employee_id == User.id
    ).filter(
        Feedback.manager_id == manager_id
    ).order_by(
        Feedback.timestamp.desc()
    ).all()

    return jsonify([{
        "id": f.Feedback.id,
        "employee_name": f.employee_name,
        "strengths": f.Feedback.strengths,
        "improvements": f.Feedback.improvements,
        "sentiment": f.Feedback.sentiment,
        "timestamp": f.Feedback.timestamp.isoformat(),
    } for f in feedback_with_employees])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True) 