import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

function FeedbackRequestModal({ open, onClose, onSuccess }) {
    const { user } = useAuth();
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchManagers = async () => {
            setLoading(true);
            try {
                const response = await api.getUsers('Manager');
                setManagers(response.data);
            } catch (error) {
                console.error('Error fetching managers:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (open) {
            fetchManagers();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!selectedManager) return;

        setLoading(true);
        try {
            await api.requestFeedback({
                requester_id: user.id,
                target_manager_id: selectedManager,
                is_anonymous: isAnonymous,
                message: message
            });
            
            onSuccess();
            onClose();
            setSelectedManager('');
            setMessage('');
            setIsAnonymous(false);
        } catch (error) {
            console.error('Error requesting feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Request Feedback</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Manager</InputLabel>
                        <Select
                            value={selectedManager}
                            onChange={(e) => setSelectedManager(e.target.value)}
                            label="Select Manager"
                        >
                            {managers.map(manager => (
                                <MenuItem key={manager.id} value={manager.id}>
                                    {manager.name} ({manager.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Additional Message (Optional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide any specific areas you'd like feedback on..."
                        sx={{ mb: 2 }}
                    />
                    
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                        }
                        label="Request anonymously"
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {isAnonymous 
                            ? "Your request will be anonymous to the manager"
                            : "The manager will see your name in the request"
                        }
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={!selectedManager || loading}
                >
                    {loading ? 'Sending...' : 'Send Request'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FeedbackRequestModal; 