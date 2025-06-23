CREATE DATABASE IF NOT EXISTS employee_feedback;
USE employee_feedback;

-- Create tables based on the models in app.py
-- Note: SQLAlchemy will handle table creation, but we can create some initial data here.

-- For simplicity, we'll add users and team data here.
-- In a real application, you'd have a registration system.

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Employee'
);

CREATE TABLE IF NOT EXISTS team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_id INT,
    employee_id INT,
    FOREIGN KEY (manager_id) REFERENCES user(id),
    FOREIGN KEY (employee_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    manager_id INT,
    strengths TEXT NOT NULL,
    improvements TEXT NOT NULL,
    sentiment VARCHAR(20) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES user(id),
    FOREIGN KEY (manager_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT,
    user_id INT,
    text TEXT NOT NULL,
    is_markdown BOOLEAN DEFAULT TRUE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS acknowledgement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT,
    employee_id INT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id),
    FOREIGN KEY (employee_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS feedback_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requester_id INT,
    target_manager_id INT,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (requester_id) REFERENCES user(id),
    FOREIGN KEY (target_manager_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id)
);


-- Insert Sample Data
-- Passwords are 'password' hashed with werkzeug.security.generate_password_hash
INSERT INTO user (name, email, password, role) VALUES
('Manager Mike', 'manager@example.com', 'pbkdf2:sha256:600000$l5W4tC72hG0bcvvs$0e1a1c22be450893047bf4a55877c08271505c6d59a72d113e6a2569502a5c51', 'Manager'),
('Employee Emily', 'employee@example.com', 'pbkdf2:sha256:600000$QyV4oF8a2b5sN7yV$29f3d9c7d428a204e3b12c852a46506dfa8a2d106f2e133e5898869c540922f5', 'Employee'),
('Peer Penny', 'peer@example.com', 'pbkdf2:sha256:600000$T9z1rV9l4g3sB6aH$97a8e2a014d45598d9e802341b21901a5857216f9e953259929d2b7f03d9b4a1', 'Employee');

-- Manager Mike manages Employee Emily
INSERT INTO team (manager_id, employee_id) VALUES (1, 2); 