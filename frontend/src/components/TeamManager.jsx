import { Add, People, Remove } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as api from '../services/api';

function TeamManager({ open, onClose, managerId }) {
    const [allEmployees, setAllEmployees] = useState([]);
    const [currentTeam, setCurrentTeam] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (open && managerId) {
            loadData();
        }
    }, [open, managerId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [teamResponse, employeesResponse] = await Promise.all([
                api.getTeam(managerId),
                api.getTeamMembers(managerId) 
            ]);
            setCurrentTeam(teamResponse.data);
            setAllEmployees(employeesResponse.data);
        } catch (error) {
            console.error('Error loading team data:', error);
            setSnackbar({ open: true, message: 'Failed to load data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async () => {
        if (!selectedEmployee) return;
        setLoading(true);
        try {
            await api.addTeamMember(managerId, selectedEmployee);
            setSnackbar({ open: true, message: 'Employee added to team!', severity: 'success' });
            setSelectedEmployee('');
            await loadData(); // Refresh data
        } catch (error) {
            console.error('Error adding employee:', error);
            setSnackbar({ open: true, message: error.response?.data?.error || 'Failed to add employee', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveEmployee = async (employeeId) => {
        setLoading(true);
        try {
            await api.removeTeamMember(managerId, employeeId);
            setSnackbar({ open: true, message: 'Employee removed from team!', severity: 'success' });
            await loadData(); // Refresh data
        } catch (error) {
            console.error('Error removing employee:', error);
            setSnackbar({ open: true, message: error.response?.data?.error || 'Failed to remove employee', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ mr: 1 }} />
                    Manage Team
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Add Employee Section */}
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Add Employee to Team</Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Select Employee</InputLabel>
                                <Select
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    label="Select Employee"
                                >
                                    {allEmployees.map(employee => (
                                        <MenuItem key={employee.id} value={employee.id}>
                                            {employee.name} ({employee.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                onClick={handleAddEmployee}
                                disabled={!selectedEmployee || loading}
                                startIcon={<Add />}
                            >
                                Add
                            </Button>
                        </Box>
                        {allEmployees.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                All available employees are already in your team
                            </Typography>
                        )}
                    </Paper>

                    {/* Current Team Section */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Current Team Members</Typography>
                        {currentTeam.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentTeam.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>{member.name}</TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        startIcon={<Remove />}
                                                        onClick={() => handleRemoveEmployee(member.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No team members assigned yet
                            </Typography>
                        )}
                    </Paper>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
}

export default TeamManager; 