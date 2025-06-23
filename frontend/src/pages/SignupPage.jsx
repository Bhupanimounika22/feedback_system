import {
    AccountCircle,
    Email,
    Lock,
    PersonAdd,
    Visibility,
    VisibilityOff,
    Work
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const FloatingShape = ({ delay = 0, duration = 20 }) => {
    const theme = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                position: 'absolute',
                width: Math.random() * 80 + 40,
                height: Math.random() * 80 + 40,
                borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                zIndex: 0,
            }}
        />
    );
};

function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.register(formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                py: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 30% 70%, ${theme.palette.primary.main}12 0%, transparent 50%),
                               radial-gradient(circle at 70% 30%, ${theme.palette.secondary.main}12 0%, transparent 50%)`,
                    pointerEvents: 'none',
                }
            }}
        >
            {/* Floating Background Shapes */}
            {[...Array(10)].map((_, i) => (
                <FloatingShape key={i} delay={i * 1.5} duration={12 + i * 1.5} />
            ))}

            <Container component="main" maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            borderRadius: '24px',
                            background: `linear-gradient(135deg, ${theme.palette.background.paper}95 0%, ${theme.palette.action.hover}95 100%)`,
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${theme.palette.divider}`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            }
                        }}
                    >
                        <Grid container>
                            {/* Left Side - Welcome Content */}
                            <Grid span={{ xs: 12, md: 5 }}>
                                <Box
                                    sx={{
                                        p: 6,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                                        position: 'relative',
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 800,
                                                mb: 3,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            Join Our
                                            <br />
                                            Community
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                            Create your account and start building better feedback relationships with your team.
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {[
                                                'Real-time feedback tracking',
                                                'Advanced analytics dashboard',
                                                'Team collaboration tools',
                                                'Secure & private platform'
                                            ].map((feature, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                            }}
                                                        />
                                                        <Typography variant="body1" color="text.secondary">
                                                            {feature}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </motion.div>
                                </Box>
                            </Grid>

                            {/* Right Side - Signup Form */}
                            <Grid span={{ xs: 12, md: 7 }}>
                                <Box sx={{ p: 6 }}>
                                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 20px',
                                                    boxShadow: `0 12px 30px ${theme.palette.primary.main}40`,
                                                }}
                                            >
                                                <PersonAdd sx={{ fontSize: 35, color: 'white' }} />
                                            </Box>
                                        </motion.div>
                                        
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            Create Account
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Fill in your details to get started
                                        </Typography>
                                    </Box>

                                    <Box component="form" onSubmit={handleSubmit} noValidate>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Alert 
                                                    severity="error" 
                                                    sx={{ 
                                                        mb: 3, 
                                                        borderRadius: '12px',
                                                        '& .MuiAlert-icon': {
                                                            fontSize: '1.5rem'
                                                        }
                                                    }}
                                                >
                                                    {error}
                                                </Alert>
                                            </motion.div>
                                        )}

                                        {success && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Alert 
                                                    severity="success" 
                                                    sx={{ 
                                                        mb: 3, 
                                                        borderRadius: '12px',
                                                        '& .MuiAlert-icon': {
                                                            fontSize: '1.5rem'
                                                        }
                                                    }}
                                                >
                                                    {success}
                                                </Alert>
                                            </motion.div>
                                        )}

                                        <Grid container spacing={2}>
                                            <Grid span={{ xs: 12 }}>
                                                <motion.div
                                                    custom={0}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={inputVariants}
                                                >
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="name"
                                                        label="Full Name"
                                                        name="name"
                                                        autoComplete="name"
                                                        autoFocus
                                                        value={formData.name}
                                                        onChange={handleChange('name')}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AccountCircle color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                '&:hover fieldset': {
                                                                    borderColor: theme.palette.primary.main,
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderWidth: '2px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </motion.div>
                                            </Grid>

                                            <Grid span={{ xs: 12 }}>
                                                <motion.div
                                                    custom={1}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={inputVariants}
                                                >
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email Address"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={formData.email}
                                                        onChange={handleChange('email')}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Email color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                '&:hover fieldset': {
                                                                    borderColor: theme.palette.primary.main,
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderWidth: '2px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </motion.div>
                                            </Grid>

                                            <Grid span={{ xs: 12 }}>
                                                <motion.div
                                                    custom={2}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={inputVariants}
                                                >
                                                    <TextField
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        label="Password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        id="password"
                                                        autoComplete="new-password"
                                                        value={formData.password}
                                                        onChange={handleChange('password')}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Lock color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={handleTogglePassword}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '12px',
                                                                '&:hover fieldset': {
                                                                    borderColor: theme.palette.primary.main,
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderWidth: '2px',
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </motion.div>
                                            </Grid>

                                            <Grid span={{ xs: 12 }}>
                                                <motion.div
                                                    custom={3}
                                                    initial="hidden"
                                                    animate="visible"
                                                    variants={inputVariants}
                                                >
                                                    <FormControl fullWidth>
                                                        <InputLabel id="role-select-label">Role</InputLabel>
                                                        <Select
                                                            labelId="role-select-label"
                                                            id="role"
                                                            value={formData.role}
                                                            label="Role"
                                                            onChange={handleChange('role')}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Work color="primary" />
                                                                </InputAdornment>
                                                            }
                                                            sx={{
                                                                borderRadius: '12px',
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: theme.palette.primary.main,
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderWidth: '2px',
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem value="Employee">Employee</MenuItem>
                                                            <MenuItem value="Manager">Manager</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </motion.div>
                                            </Grid>
                                        </Grid>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                disabled={loading}
                                                sx={{
                                                    mt: 4,
                                                    mb: 3,
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 600,
                                                    borderRadius: '12px',
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                                                    '&:hover': {
                                                        boxShadow: `0 12px 35px ${theme.palette.primary.main}60`,
                                                        transform: 'translateY(-2px)',
                                                    },
                                                    '&:disabled': {
                                                        background: theme.palette.action.disabledBackground,
                                                    }
                                                }}
                                            >
                                                {loading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    >
                                                        <PersonAdd />
                                                    </motion.div>
                                                ) : (
                                                    'Create Account'
                                                )}
                                            </Button>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.7 }}
                                        >
                                            <Grid container justifyContent="center">
                                                <Grid span={{ xs: 12 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Already have an account?{' '}
                                                        <Link 
                                                            component={RouterLink} 
                                                            to="/login" 
                                                            sx={{
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                                backgroundClip: 'text',
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                '&:hover': {
                                                                    textDecoration: 'underline',
                                                                }
                                                            }}
                                                        >
                                                            Sign In
                                                        </Link>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </motion.div>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}

export default SignupPage;