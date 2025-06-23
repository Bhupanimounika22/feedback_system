import { Add } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as api from '../services/api';

const PREDEFINED_TAGS = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
    'Time Management', 'Technical Skills', 'Creativity', 'Adaptability',
    'Initiative', 'Quality', 'Collaboration', 'Innovation'
];

function TagManager({ feedbackId, onTagsChange }) {
    const [tags, setTags] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (feedbackId) {
            loadTags();
        }
    }, [feedbackId]);

    const loadTags = async () => {
        try {
            const response = await api.getFeedbackTags(feedbackId);
            setTags(response.data);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    const handleAddTag = async () => {
        if (!newTag.trim()) return;

        setLoading(true);
        try {
            await api.addFeedbackTag({
                feedback_id: feedbackId,
                tag_name: newTag.trim()
            });
            setNewTag('');
            await loadTags();
            if (onTagsChange) onTagsChange();
        } catch (error) {
            console.error('Error adding tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTag = async (tagId) => {
        try {
            await api.deleteFeedbackTag(tagId);
            await loadTags();
            if (onTagsChange) onTagsChange();
        } catch (error) {
            console.error('Error deleting tag:', error);
        }
    };

    const handlePredefinedTagClick = (tagName) => {
        setNewTag(tagName);
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">Tags</Typography>
                    <Button size="small" onClick={() => setOpen(true)}>
                        Manage Tags
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {tags.map(tag => (
                        <Chip
                            key={tag.id}
                            label={tag.tag_name}
                            onDelete={() => handleDeleteTag(tag.id)}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    ))}
                    {tags.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No tags added
                        </Typography>
                    )}
                </Box>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Manage Tags</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Add New Tag
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter tag name"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddTag}
                                disabled={!newTag.trim() || loading}
                                startIcon={<Add />}
                            >
                                Add
                            </Button>
                        </Box>

                        <Typography variant="subtitle2" gutterBottom>
                            Predefined Tags
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {PREDEFINED_TAGS.map(tagName => (
                                <Chip
                                    key={tagName}
                                    label={tagName}
                                    onClick={() => handlePredefinedTagClick(tagName)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TagManager; 