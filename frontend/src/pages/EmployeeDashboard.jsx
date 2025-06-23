import {
    CheckCircle,
    EmojiEvents,
    Insights,
    RateReview,
    RequestQuote,
    Star,
    Timeline
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Grid,
    LinearProgress,
    Snackbar,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import FeedbackRequestModal from '../components/FeedbackRequestModal';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

// Enhanced Statistics Card Component
const StatsCard = ({ icon, title, value, subtitle, color, delay = 0, progress = null }) => {
    const theme = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
        >
            <Card
                sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    },
                    '&:hover': {
                        boxShadow: `0 20px 40px ${color}20`,
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 24px ${color}40`,
                            }}
                        >
                            {React.cloneElement(icon, { sx: { fontSize: 28, color: 'white' } })}
                        </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color }}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {subtitle}
                    </Typography>
                    {progress !== null && (
                        <Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: `${color}20`,
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: color,
                                        borderRadius: 3,
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {progress}% completed
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Enhanced Feedback Card Component
const FeedbackCard = ({ feedback, onAcknowledge, delay = 0 }) => {
    const theme = useTheme();
    
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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
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
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    background: `linear-gradient(135deg, ${getSentimentColor(feedback.sentiment)}, ${getSentimentColor(feedback.sentiment)}80)`,
                                }}
                            >
                                {getSentimentIcon(feedback.sentiment)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Feedback from {feedback.manager_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(feedback.timestamp).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={feedback.sentiment}
                                size="small"
                                sx={{
                                    background: `${getSentimentColor(feedback.sentiment)}20`,
                                    color: getSentimentColor(feedback.sentiment),
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                }}
                            />
                            {feedback.acknowledged && (
                                <Tooltip title="Acknowledged">
                                    <CheckCircle sx={{ color: '#22c55e', fontSize: 20 }} />
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid span={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: '#22c55e10',
                                    border: '1px solid #22c55e20',
                                    height: '100%'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: '#22c55e', fontWeight: 600, mb: 1 }}>
                                    💪 Strengths
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                    {feedback.strengths}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid span={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: '#3b82f610',
                                    border: '1px solid #3b82f620',
                                    height: '100%'
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontWeight: 600, mb: 1 }}>
                                    🚀 Growth Areas
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                    {feedback.improvements}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {feedback.tags && feedback.tags.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Tags
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {feedback.tags.map((tag, index) => (
                                    <Chip key={index} label={tag.tag_name} size="small" />
                                ))}
                            </Box>
                        </Box>
                    )}
                </CardContent>
                
                {!feedback.acknowledged && (
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                        <Button 
                            size="small" 
                            onClick={() => onAcknowledge(feedback.id)}
                            startIcon={<CheckCircle />}
                        >
                            Acknowledge
                        </Button>
                    </CardActions>
                )}
            </Card>
        </motion.div>
    );
};


function EmployeeDashboard() {
    const { user } = useAuth();
    const theme = useTheme();
    const [feedback, setFeedback] = useState([]);
    const [stats, setStats] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [feedbackRequests, setFeedbackRequests] = useState([]);
    const [lastRequestStatuses, setLastRequestStatuses] = useState({});

    useEffect(() => {
        if (user) {
            loadFeedback();
            loadStats();
            loadEmployeeRequests();
        }
    }, [user]);

    const loadFeedback = async () => {
        try {
            const response = await api.getEmployeeFeedback(user.id);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error loading feedback:', error);
            setSnackbar({ open: true, message: 'Failed to load feedback', severity: 'error' });
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.getEmployeeStats(user.id);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching employee stats:', error);
        }
    };

    const loadEmployeeRequests = async () => {
        try {
            const res = await api.getEmployeeFeedbackRequests(user.id);
            setFeedbackRequests(res.data);
            // Check for status changes to notify
            const newStatuses = {};
            res.data.forEach(req => {
                newStatuses[req.id] = req.status;
            });
            // Compare with previous
            Object.entries(newStatuses).forEach(([id, status]) => {
                if (lastRequestStatuses[id] && lastRequestStatuses[id] !== status) {
                    setSnackbar({
                        open: true,
                        message: `Your feedback request was ${status}.`,
                        severity: status === 'approved' ? 'success' : 'warning',
                    });
                }
            });
            setLastRequestStatuses(newStatuses);
        } catch (error) {
            setFeedbackRequests([]);
        }
    };

    const handleRequestFeedback = () => {
        setRequestModalOpen(true);
    };

    const handleFeedbackRequestSuccess = () => {
        setSnackbar({ open: true, message: 'Feedback request sent successfully!', severity: 'success' });
    };

    const handleAcknowledgeFeedback = async (feedbackId) => {
        try {
            await api.acknowledgeFeedback({ feedback_id: feedbackId, employee_id: user.id });
            loadFeedback(); // Refresh feedback to show acknowledgement
            setSnackbar({ open: true, message: 'Feedback acknowledged!', severity: 'success' });
        } catch (error) {
            console.error('Error acknowledging feedback:', error);
            setSnackbar({ open: true, message: 'Failed to acknowledge feedback', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Your Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<RequestQuote />}
                        onClick={handleRequestFeedback}
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                            }
                        }}
                    >
                        Request Feedback
                    </Button>
                </Box>

                {/* Statistics Section */}
                {stats && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <Grid container spacing={4}>
                            <Grid span={{ xs: 12, md: 4 }}>
                                <StatsCard
                                    icon={<RateReview />}
                                    title="Total Feedback Received"
                                    value={stats.total_feedback}
                                    subtitle="All-time feedback count"
                                    color="#3b82f6"
                                    delay={0.1}
                                />
                            </Grid>
                            <Grid span={{ xs: 12, md: 4 }}>
                                <StatsCard
                                    icon={<EmojiEvents />}
                                    title="Positive Feedback"
                                    value={`${stats?.sentiment_distribution?.positive || 0}%`}
                                    subtitle="Based on sentiment analysis"
                                    color="#22c55e"
                                    delay={0.2}
                                />
                            </Grid>
                            <Grid span={{ xs: 12, md: 4 }}>
                                <StatsCard
                                    icon={<CheckCircle />}
                                    title="Acknowledged"
                                    value={`${stats?.acknowledgement_rate ?? 0}%`}
                                    subtitle="You have acknowledged"
                                    color="#f97316"
                                    delay={0.3}
                                    progress={parseFloat(stats?.acknowledgement_rate ?? 0)}
                                />
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* Feedback Requests Section */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                        Your Feedback Requests
                    </Typography>
                    {feedbackRequests.length > 0 ? (
                        feedbackRequests.map(req => (
                            <Card key={req.id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        To: {req.manager_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {req.message}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    color={req.status === 'approved' ? 'success' : req.status === 'declined' ? 'error' : 'warning'}
                                    sx={{ fontWeight: 600 }}
                                />
                            </Card>
                        ))
                    ) : (
                        <Typography color="text.secondary">You have not made any feedback requests yet.</Typography>
                    )}
                </Box>

                {/* Recent Feedback Section */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                        Your Recent Feedback
                    </Typography>
                    <AnimatePresence>
                        {feedback.length > 0 ? (
                            feedback.map((item, index) => (
                                <FeedbackCard 
                                    key={item.id} 
                                    feedback={item} 
                                    onAcknowledge={handleAcknowledgeFeedback}
                                    delay={index * 0.1}
                                />
                            ))
                        ) : (
                            <Card sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">You haven't received any feedback yet.</Typography>
                            </Card>
                        )}
                    </AnimatePresence>
                </Box>

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
                
                <FeedbackRequestModal
                    open={requestModalOpen}
                    onClose={() => setRequestModalOpen(false)}
                    onSuccess={handleFeedbackRequestSuccess}
                />
            </Container>
        </DashboardLayout>
    );
}

export default EmployeeDashboard;