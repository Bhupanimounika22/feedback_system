import {
    ArrowBack,
    AutoAwesome,
    CalendarToday,
    Delete,
    Edit,
    EmojiEvents,
    Insights,
    Psychology,
    RateReview,
    Star,
    Timeline,
    TrendingUp
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Grid,
    IconButton,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

// Enhanced Statistics Card Component
const StatCard = ({ icon, title, value, subtitle, color, delay = 0 }) => {
    const theme = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ scale: 1.05 }}
        >
            <Card
                sx={{
                    height: '100%',
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
                        height: '3px',
                        background: `linear-gradient(90deg, ${color}, ${color}80)`,
                    },
                    '&:hover': {
                        boxShadow: `0 8px 25px ${color}20`,
                    }
                }}
            >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${color}, ${color}80)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            boxShadow: `0 4px 15px ${color}40`,
                        }}
                    >
                        {React.cloneElement(icon, { sx: { fontSize: 24, color: 'white' } })}
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color }}>
                        {value}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Enhanced Feedback Card Component
const FeedbackCard = ({ feedback, onDelete, canManage, delay = 0 }) => {
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
                                    Feedback from {feedback.manager_name || 'Manager'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(feedback.timestamp || feedback.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
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
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid span={{ xs: 12, md: 6, sm: 6, lg: 6 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: '#22c55e10',
                                    border: '1px solid #22c55e20',
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
                        <Grid span={{ xs: 12, md: 6, sm: 6, lg: 6 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    background: '#3b82f610',
                                    border: '1px solid #3b82f620',
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
                                {feedback.tags.map(tag => (
                                    <Chip 
                                        key={tag.id}
                                        label={tag.tag_name}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </CardContent>

                {canManage && (
                    <CardActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit Feedback">
                            <Button
                                size="small"
                                startIcon={<Edit />}
                                sx={{
                                    borderRadius: '8px',
                                    mr: 1,
                                }}
                            >
                                Edit
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete Feedback">
                            <Button
                                size="small"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => onDelete(feedback.id)}
                                sx={{
                                    borderRadius: '8px',
                                }}
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    </CardActions>
                )}
            </Card>
        </motion.div>
    );
};

function TeamMemberFeedbackPage() {
    const { employeeId } = useParams();
    const { user } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        if (employeeId) {
            loadEmployeeDetails();
            loadFeedbackHistory();
        }
    }, [employeeId]);

    const loadEmployeeDetails = async () => {
        try {
            const response = await api.getUser(employeeId);
            setEmployee(response.data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const loadFeedbackHistory = async () => {
        try {
            const response = await api.getEmployeeFeedback(employeeId);
            setFeedback(response.data);
        } catch (error) {
            console.error('Error fetching feedback history:', error);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await api.deleteFeedback(feedbackId);
                loadFeedbackHistory(); // Refresh the list
            } catch (error) {
                console.error('Error deleting feedback:', error);
            }
        }
    };

    // Calculate statistics
    const stats = feedback.length > 0 ? {
        totalFeedback: feedback.length,
        positiveFeedback: feedback.filter(f => f.sentiment === 'positive').length,
        negativeFeedback: feedback.filter(f => f.sentiment === 'negative').length,
        recentFeedback: feedback.filter(f => {
            const feedbackDate = new Date(f.timestamp || f.created_at);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return feedbackDate >= monthAgo;
        }).length
    } : null;

    if (!employee) {
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
                            Loading team member details...
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
            <Container maxWidth="xl">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Box sx={{ mb: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Tooltip title="Back to Dashboard">
                                <IconButton 
                                    onClick={() => navigate('/manager')}
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
                                    width: 70,
                                    height: 70,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 15px 35px ${theme.palette.primary.main}40`,
                                    fontSize: '1.8rem',
                                    fontWeight: 'bold',
                                    color: 'white'
                                }}
                            >
                                {employee.name.charAt(0)}
                            </Box>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    {employee.name}'s Journey
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    Comprehensive feedback history and insights
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>

                {/* Statistics Cards */}
                {stats && (
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        <Grid span={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                icon={<RateReview />}
                                title="Total Feedback"
                                value={stats.totalFeedback}
                                subtitle="All feedback sessions"
                                color={theme.palette.primary.main}
                                delay={0.1}
                            />
                        </Grid>
                        <Grid span={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                icon={<EmojiEvents />}
                                title="Positive"
                                value={stats.positiveFeedback}
                                subtitle="Recognition received"
                                color="#22c55e"
                                delay={0.2}
                            />
                        </Grid>
                        <Grid span={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                icon={<TrendingUp />}
                                title="Growth Areas"
                                value={stats.negativeFeedback}
                                subtitle="Improvement opportunities"
                                color="#f59e0b"
                                delay={0.3}
                            />
                        </Grid>
                        <Grid span={{ xs: 12, sm: 6, lg: 3 }}>
                            <StatCard
                                icon={<CalendarToday />}
                                title="Recent"
                                value={stats.recentFeedback}
                                subtitle="Past 30 days"
                                color="#8b5cf6"
                                delay={0.4}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* Feedback History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                >
                    <Card
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '20px',
                            overflow: 'hidden',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main}80)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Psychology sx={{ color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        Feedback Timeline
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feedback.length} feedback sessions recorded
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ maxHeight: 800, overflowY: 'auto', pr: 1 }}>
                                <AnimatePresence>
                                    {feedback.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {feedback.map((fb, index) => (
                                                <Grid span={{ xs: 12 }} key={fb.id}>
                                                    <FeedbackCard
                                                        feedback={fb}
                                                        onDelete={handleDeleteFeedback}
                                                        canManage={fb.manager_id === user.id}
                                                        delay={index * 0.1}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                                <AutoAwesome sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                                    No Feedback Yet
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                                    This team member hasn't received any feedback yet
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<RateReview />}
                                                    onClick={() => navigate('/manager')}
                                                    sx={{ borderRadius: '25px' }}
                                                >
                                                    Go Back to Dashboard
                                                </Button>
                                            </Box>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </Box>
    );
}

export default TeamMemberFeedbackPage; 