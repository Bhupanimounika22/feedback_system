import {
    Assignment,
    Insights,
    Notifications,
    People,
    Settings,
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
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import TeamManager from '../components/TeamManager';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const StatsCard = ({ icon, title, value, subtitle, color, delay = 0 }) => {
    const theme = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ height: '100%' }}
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
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const FeedbackCard = ({ feedback }) => {
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
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card
                sx={{
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
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
                                    Feedback for {feedback.employee_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(feedback.timestamp).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
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
                     <Grid container spacing={2}>
                        <Grid xs={12} md={6}>
                            <Box sx={{ p: 2, borderRadius: '12px', background: '#22c55e10', border: '1px solid #22c55e20', height: '100%' }}>
                                <Typography variant="subtitle2" sx={{ color: '#22c55e', fontWeight: 600, mb: 1 }}>Strengths</Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{feedback.strengths}</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} md={6}>
                             <Box sx={{ p: 2, borderRadius: '12px', background: '#3b82f610', border: '1px solid #3b82f620', height: '100%' }}>
                                <Typography variant="subtitle2" sx={{ color: '#3b82f6', fontWeight: 600, mb: 1 }}>Growth Areas</Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{feedback.improvements}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                 <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                    <Button component={RouterLink} to={`/feedback/${feedback.id}`} size="small">
                        View Details
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

function ManagerDashboard() {
    const { user } = useAuth();
    const theme = useTheme();
    const [team, setTeam] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [strengths, setStrengths] = useState('');
    const [improvements, setImprovements] = useState('');
    const [sentiment, setSentiment] = useState('positive');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [stats, setStats] = useState(null);
    const [feedbackRequests, setFeedbackRequests] = useState([]);
    const [feedbackHistory, setFeedbackHistory] = useState([]);
    const [teamManagerOpen, setTeamManagerOpen] = useState(false);
    const [requestLoading, setRequestLoading] = useState({});

    useEffect(() => {
        if (user) {
            loadTeam();
            loadStats();
            loadFeedbackRequests();
            loadFeedbackHistory();
        }
    }, [user]);

    const loadTeam = async () => {
        try {
            const response = await api.getTeam(user.id);
            setTeam(response.data);
        } catch (error) {
            console.error('Error fetching team:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.getManagerStats(user.id);
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadFeedbackRequests = async () => {
        try {
            const response = await api.getFeedbackRequests(user.id);
            setFeedbackRequests(response.data);
        } catch (error) {
            console.error('Error loading feedback requests:', error);
        }
    };

    const loadFeedbackHistory = async () => {
        try {
            const response = await api.getManagerFeedback(user.id); // Assumes this API endpoint exists
            setFeedbackHistory(response.data);
        } catch (error) {
            console.error('Error loading feedback history:', error);
        }
    };

    const handleRequestUpdate = async (requestId, status) => {
        setRequestLoading(prev => ({ ...prev, [requestId]: true }));
        try {
            await api.updateFeedbackRequestStatus(requestId, { status });
            setSnackbar({ open: true, message: `Request ${status}`, severity: 'success' });
            loadFeedbackRequests(); // Refresh the list
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update request', severity: 'error' });
        } finally {
            setRequestLoading(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            setSnackbar({ open: true, message: 'Please select an employee', severity: 'warning' });
            return;
        }
        setLoading(true);
        try {
            await api.submitFeedback({
                employee_id: selectedEmployee,
                manager_id: user.id,
                strengths,
                improvements,
                sentiment,
            });
            setSnackbar({ open: true, message: 'Feedback submitted successfully!', severity: 'success' });
            setSelectedEmployee('');
            setStrengths('');
            setImprovements('');
            setSentiment('positive');
            loadStats();
            loadFeedbackHistory();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to submit feedback', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <DashboardLayout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Manager Dashboard
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Settings />}
                        onClick={() => setTeamManagerOpen(true)}
                    >
                        Manage Team
                    </Button>
                </Box>

                {/* Statistics Section */}
                {stats && (
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        <Grid xs={12} sm={6} md={3}>
                            <StatsCard icon={<People />} title="Team Members" value={team.length} subtitle="Active members" color="#3b82f6" />
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <StatsCard icon={<Assignment />} title="Feedback Given" value={stats.total_feedback} subtitle="Total sessions" color="#8b5cf6" />
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <StatsCard icon={<Insights />} title="Positive Sentiment" value={`${stats?.positive_feedback || 0}%`} subtitle="Overall sentiment" color="#22c55e" />
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <StatsCard icon={<Notifications />} title="Pending Requests" value={feedbackRequests.filter(req => req.status === 'pending').length} subtitle="Awaiting approval" color="#f97316" />
                        </Grid>
                    </Grid>
                )}

                {/* Pending Requests */}
                {feedbackRequests.filter(req => req.status === 'pending').length > 0 &&
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Pending Requests</Typography>
                        {feedbackRequests.filter(req => req.status === 'pending').map(request => (
                            <Card key={request.id} sx={{ mb: 2, p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{request.requester_name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{request.message || "No message provided."}</Typography>
                                    </Box>
                                    <Box>
                                        <Button size="small" variant="contained" color="success" onClick={() => handleRequestUpdate(request.id, 'approved')} disabled={requestLoading[request.id]} sx={{ mr: 1 }}>Approve</Button>
                                        <Button size="small" variant="outlined" color="error" onClick={() => handleRequestUpdate(request.id, 'declined')} disabled={requestLoading[request.id]}>Decline</Button>
                                    </Box>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                }

                {/* Main Grid */}
                <Grid container spacing={4}>
                    <Grid xs={12} md={5}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Submit Feedback</Typography>
                        <Card sx={{ p: 3 }}>
                            <Box component="form" onSubmit={handleSubmit}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Select Team Member</InputLabel>
                                    <Select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} label="Select Team Member">
                                        {team.map(member => <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth multiline rows={3} label="Strengths" value={strengths} onChange={(e) => setStrengths(e.target.value)} sx={{ mb: 2 }} />
                                <TextField fullWidth multiline rows={3} label="Areas for Growth" value={improvements} onChange={(e) => setImprovements(e.target.value)} sx={{ mb: 2 }} />
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Sentiment</InputLabel>
                                    <Select value={sentiment} onChange={(e) => setSentiment(e.target.value)} label="Sentiment">
                                        <MenuItem value="positive">Positive</MenuItem>
                                        <MenuItem value="neutral">Neutral</MenuItem>
                                        <MenuItem value="negative">Needs Attention</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button type="submit" variant="contained" disabled={loading} fullWidth>{loading ? 'Submitting...' : 'Submit'}</Button>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={7}>
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Feedback History</Typography>
                        {feedbackHistory.length > 0 ? (
                            feedbackHistory.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
                        ) : (
                            <Card sx={{p: 4, textAlign: 'center'}}>
                                <Typography color="text.secondary">You haven't submitted any feedback yet.</Typography>
                            </Card>
                        )}
                    </Grid>
                </Grid>

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
                </Snackbar>
                <TeamManager open={teamManagerOpen} onClose={() => setTeamManagerOpen(false)} managerId={user?.id} onTeamUpdate={loadTeam} />
            </Container>
        </DashboardLayout>
    );
}

export default ManagerDashboard;