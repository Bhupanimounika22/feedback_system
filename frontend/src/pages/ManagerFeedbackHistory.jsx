import { ArrowBack, Insights, Star, Timeline } from '@mui/icons-material';
import { Box, Card, CircularProgress, Container, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const FeedbackCard = ({ feedback }) => {
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setLoadingComments(true);
            try {
                const res = await api.getComments(feedback.id);
                setComments(res.data);
            } catch {
                setComments([]);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [feedback.id]);

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
        <Card sx={{ mb: 3, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `${getSentimentColor(feedback.sentiment)}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {getSentimentIcon(feedback.sentiment)}
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Feedback for {feedback.employee_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(feedback.timestamp).toLocaleDateString()}
                    </Typography>
                </Box>
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
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Comments</Typography>
                {loadingComments ? (
                    <Typography color="text.secondary">Loading comments...</Typography>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <Box key={comment.id} sx={{ mb: 1, pl: 1, borderLeft: '3px solid #eee' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{comment.author_name || 'User'}:</Typography>
                            <Typography variant="body2">{comment.text}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography color="text.secondary">No comments yet.</Typography>
                )}
            </Box>
        </Card>
    );
};

function ManagerFeedbackHistory() {
    const { user } = useAuth();
    const [feedbackHistory, setFeedbackHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await api.getManagerFeedback(user.id);
                setFeedbackHistory(res.data);
            } catch (err) {
                setFeedbackHistory([]);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchHistory();
    }, [user]);

    return (
        <DashboardLayout>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Tooltip title="Back">
                        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Feedback History
                    </Typography>
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : feedbackHistory.length > 0 ? (
                    feedbackHistory.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
                ) : (
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No feedback history found.</Typography>
                    </Card>
                )}
            </Container>
        </DashboardLayout>
    );
}

export default ManagerFeedbackHistory; 