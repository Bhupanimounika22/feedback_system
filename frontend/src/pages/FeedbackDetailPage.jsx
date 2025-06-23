import {
    ArrowBack,
    AutoAwesome,
    CalendarToday,
    CheckCircle,
    CommentOutlined,
    Download,
    EmojiEvents,
    Insights,
    Psychology,
    Send,
    Star,
    Timeline
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    IconButton,
    Snackbar,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { marked } from 'marked';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TagManager from '../components/TagManager';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

function FeedbackDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [acknowledgements, setAcknowledgements] = useState([]);
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (id) {
            loadFeedback();
            loadComments();
            loadAcknowledgements();
        }
    }, [id]);

    const loadFeedback = async () => {
        try {
            const response = await api.getFeedback(id);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error loading feedback:', error);
            // Fallback to mock data if API fails
            const mockFeedback = {
                id: id,
                strengths: 'Great leadership skills and project management.',
                improvements: 'Could be more proactive in team meetings.',
                sentiment: 'positive',
                manager: { name: 'Manager Mike' },
                employee: { name: 'Employee Emily' },
                timestamp: new Date().toISOString()
            };
            setFeedback(mockFeedback);
        }
    };

    const loadComments = async () => {
        try {
            const response = await api.getComments(id);
            setComments(response.data);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const loadAcknowledgements = async () => {
        try {
            const response = await api.getAcknowledgements(id);
            setAcknowledgements(response.data);
            // Check if current user has acknowledged this feedback
            const userAcknowledged = response.data.some(ack => ack.employee_id === user.id);
            setIsAcknowledged(userAcknowledged);
        } catch (error) {
            console.error('Error loading acknowledgements:', error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        
        try {
            const commentData = {
                feedback_id: id,
                user_id: user.id,
                text: newComment,
            };
            await api.addComment(commentData);
            setNewComment('');
            await loadComments(); // Refresh comments
            setSnackbar({ open: true, message: 'Comment added successfully!', severity: 'success' });
        } catch (error) {
            console.error('Error adding comment:', error);
            setSnackbar({ open: true, message: 'Failed to add comment', severity: 'error' });
        }
    };

    const handleAcknowledge = async () => {
        try {
            await api.acknowledgeFeedback({
                feedback_id: id,
                employee_id: user.id
            });
            setIsAcknowledged(true);
            await loadAcknowledgements();
            setSnackbar({ open: true, message: 'Feedback acknowledged!', severity: 'success' });
        } catch (error) {
            console.error('Error acknowledging feedback:', error);
            setSnackbar({ open: true, message: 'Failed to acknowledge feedback', severity: 'error' });
        }
    };

    const handleExport = () => {
        window.open(`http://localhost:5001/api/feedback/export/${id}`);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '#22c55e';
            case 'negative': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'positive': return <Star />;
            case 'negative': return <Insights />;
            default: return <Timeline />;
        }
    };

    if (!feedback) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <AutoAwesome sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Loading feedback details...
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
                pt: { xs: 10, md: 12 },
                pb: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Tooltip title="Go Back">
                                <IconButton 
                                    onClick={() => navigate(-1)}
                                    sx={{
                                        background: `${theme.palette.primary.main}10`,
                                        '&:hover': { 
                                            background: `${theme.palette.primary.main}20`,
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                            </Tooltip>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${getSentimentColor(feedback.sentiment)}, ${getSentimentColor(feedback.sentiment)}80)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 15px 35px ${getSentimentColor(feedback.sentiment)}40`,
                                }}
                            >
                                {getSentimentIcon(feedback.sentiment)}
                            </Box>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Feedback Details
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Detailed view with comments and insights
                                </Typography>
                            </Box>
                        </Box>
                        
                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {user.role === 'Employee' && !isAcknowledged && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant="contained"
                                        startIcon={<CheckCircle />}
                                        onClick={handleAcknowledge}
                                        sx={{
                                            background: `linear-gradient(135deg, #22c55e, #16a34a)`,
                                            borderRadius: '25px',
                                            fontWeight: 600,
                                            boxShadow: `0 4px 15px #22c55e40`,
                                            '&:hover': {
                                                boxShadow: `0 6px 20px #22c55e60`,
                                            }
                                        }}
                                    >
                                        Acknowledge Feedback
                                    </Button>
                                </motion.div>
                            )}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<Download />} 
                                    onClick={handleExport}
                                    sx={{
                                        borderRadius: '25px',
                                        fontWeight: 600,
                                        borderColor: theme.palette.primary.main,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.dark,
                                            background: `${theme.palette.primary.main}10`,
                                        }
                                    }}
                                >
                                    Export PDF
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>

                {/* Main Content */}
                <Grid container spacing={3}>
                    {/* Feedback Content */}
                    <Grid span={{ xs: 12, lg: 8 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${getSentimentColor(feedback.sentiment)}, ${getSentimentColor(feedback.sentiment)}80)`,
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    {/* Feedback Header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 45, height: 45 }}>
                                                {feedback.manager?.name?.charAt(0) || 'M'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    From: {feedback.manager?.name || 'Manager'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(feedback.timestamp).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={feedback.sentiment}
                                            sx={{
                                                background: `${getSentimentColor(feedback.sentiment)}20`,
                                                color: getSentimentColor(feedback.sentiment),
                                                fontWeight: 600,
                                                textTransform: 'capitalize',
                                            }}
                                        />
                                    </Box>

                                    {/* Feedback Content */}
                                    <Grid container spacing={3}>
                                        <Grid span={{ xs: 12, md: 6 }}>
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: '16px',
                                                    background: '#22c55e10',
                                                    border: '1px solid #22c55e20',
                                                    height: '100%',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <EmojiEvents sx={{ color: '#22c55e' }} />
                                                    <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                        Strengths
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                                    {feedback.strengths}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid span={{ xs: 12, md: 6 }}>
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: '16px',
                                                    background: '#3b82f610',
                                                    border: '1px solid #3b82f620',
                                                    height: '100%',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <Psychology sx={{ color: '#3b82f6' }} />
                                                    <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                                                        Growth Areas
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                                    {feedback.improvements}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Tags Section */}
                                    <Box sx={{ mt: 3 }}>
                                        <TagManager feedbackId={id} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Card
                                sx={{
                                    mt: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <CommentOutlined sx={{ color: theme.palette.primary.main }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Discussion ({comments.length})
                                        </Typography>
                                    </Box>

                                    {/* Comments List */}
                                    <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
                                        <AnimatePresence>
                                            {comments.map((comment, index) => (
                                                <motion.div
                                                    key={comment.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                                        <Avatar sx={{ width: 40, height: 40 }}>
                                                            {comment.user_name?.charAt(0) || 'U'}
                                                        </Avatar>
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                p: 2,
                                                                borderRadius: '12px',
                                                                background: theme.palette.action.hover,
                                                                border: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                                                {comment.user_name}
                                                            </Typography>
                                                            <div dangerouslySetInnerHTML={{ __html: marked(comment.text) }} />
                                                            <Typography variant="caption" color="text.secondary">
                                                                {new Date(comment.timestamp).toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {comments.length === 0 && (
                                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No comments yet. Be the first to start a discussion!
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Add Comment */}
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Share your thoughts..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                }
                                            }}
                                        />
                                        <Button 
                                            variant="contained" 
                                            onClick={handleCommentSubmit} 
                                            disabled={!newComment.trim()}
                                            sx={{
                                                borderRadius: '12px',
                                                minWidth: 'auto',
                                                px: 3,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            }}
                                        >
                                            <Send />
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Sidebar */}
                    <Grid span={{ xs: 12, lg: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {/* Acknowledgements */}
                            {acknowledgements.length > 0 && (
                                <Card
                                    sx={{
                                        mb: 3,
                                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: '16px',
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                            Acknowledgements ({acknowledgements.length})
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {acknowledgements.map(ack => (
                                                <Chip
                                                    key={ack.id}
                                                    label={`Employee ${ack.employee_id}`}
                                                    size="small"
                                                    sx={{
                                                        background: '#22c55e20',
                                                        color: '#22c55e',
                                                        fontWeight: 600,
                                                    }}
                                                    icon={<CheckCircle sx={{ color: '#22c55e' }} />}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Feedback Info */}
                            <Card
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '16px',
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                        Feedback Info
                                    </Typography>
                                    <Box sx={{ space: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Employee:</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {feedback.employee?.name || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Status:</Typography>
                                            <Chip
                                                label={isAcknowledged ? 'Acknowledged' : 'Pending'}
                                                size="small"
                                                color={isAcknowledged ? 'success' : 'warning'}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Comments:</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {comments.length}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>

            {/* Enhanced Snackbar */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: '100%',
                        borderRadius: '12px',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default FeedbackDetailPage; 