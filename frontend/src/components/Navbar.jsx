import {
    Brightness4,
    Brightness7,
    Close,
    Dashboard,
    ExitToApp,
    LoginRounded,
    Menu,
    Person,
    PersonAdd,
    RocketLaunch
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    MenuItem,
    Menu as MuiMenu,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar({ toggleTheme, currentTheme }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isLandingPage = location.pathname === '/';
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    const handleUserMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        handleUserMenuClose();
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Don't show navbar on auth pages
    if (isAuthPage) {
        return null;
    }

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: isLandingPage 
                    ? `linear-gradient(135deg, ${theme.palette.background.paper}95 0%, ${theme.palette.action.hover}95 100%)`
                    : theme.palette.background.paper,
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                                }}
                            >
                                <RocketLaunch sx={{ color: 'white', fontSize: 20 }} />
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: { xs: 'none', sm: 'block' }
                                }}
                            >
                                FeedbackPro
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <Button
                                        component={Link}
                                        to={user.role === 'Manager' ? '/manager' : '/employee'}
                                        startIcon={<Dashboard />}
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            '&:hover': {
                                                background: `${theme.palette.primary.main}10`,
                                            }
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                </motion.div>

                                {/* Theme Toggle */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <IconButton
                                        onClick={toggleTheme}
                                        sx={{
                                            color: 'text.primary',
                                            '&:hover': {
                                                background: `${theme.palette.primary.main}10`,
                                            }
                                        }}
                                    >
                                        {currentTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                    </IconButton>
                                </motion.div>

                                {/* User Menu */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <IconButton
                                        onClick={handleUserMenuOpen}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {getInitials(user.name || user.email)}
                                        </Avatar>
                                    </IconButton>
                                </motion.div>

                                <MuiMenu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleUserMenuClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1,
                                            borderRadius: '12px',
                                            minWidth: 200,
                                            boxShadow: theme.shadows[8],
                                        }
                                    }}
                                >
                                    <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {user.name || user.email?.split('@')[0]}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {user.role}
                                        </Typography>
                                    </Box>
                                    <MenuItem onClick={handleUserMenuClose}>
                                        <Person sx={{ mr: 2 }} />
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ExitToApp sx={{ mr: 2 }} />
                                        Logout
                                    </MenuItem>
                                </MuiMenu>
                            </>
                        ) : (
                            <>
                                {/* Theme Toggle for non-authenticated users */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <IconButton
                                        onClick={toggleTheme}
                                        sx={{
                                            color: 'text.primary',
                                            '&:hover': {
                                                background: `${theme.palette.primary.main}10`,
                                            }
                                        }}
                                    >
                                        {currentTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                    </IconButton>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/login"
                                        startIcon={<LoginRounded />}
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 500,
                                            '&:hover': {
                                                background: `${theme.palette.primary.main}10`,
                                            }
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Button
                                        component={Link}
                                        to="/signup"
                                        variant="contained"
                                        startIcon={<PersonAdd />}
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: '25px',
                                            px: 3,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                                            '&:hover': {
                                                boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                                                transform: 'translateY(-1px)',
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </motion.div>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu Button */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                        <IconButton
                            onClick={toggleTheme}
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    background: `${theme.palette.primary.main}10`,
                                }
                            }}
                        >
                            {currentTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        
                        <IconButton
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    background: `${theme.palette.primary.main}10`,
                                }
                            }}
                        >
                            {mobileMenuOpen ? <Close /> : <Menu />}
                        </IconButton>
                    </Box>
                </Toolbar>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                py: 2,
                                borderTop: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            {user ? (
                                <>
                                    <Box sx={{ px: 2, py: 1, mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                }}
                                            >
                                                {getInitials(user.name || user.email)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {user.name || user.email?.split('@')[0]}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {user.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    
                                    <Button
                                        component={Link}
                                        to={user.role === 'Manager' ? '/manager' : '/employee'}
                                        fullWidth
                                        startIcon={<Dashboard />}
                                        onClick={() => setMobileMenuOpen(false)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2,
                                            py: 1,
                                            color: 'text.primary',
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                    
                                    <Button
                                        fullWidth
                                        startIcon={<ExitToApp />}
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2,
                                            py: 1,
                                            color: 'text.primary',
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        to="/login"
                                        fullWidth
                                        startIcon={<LoginRounded />}
                                        onClick={() => setMobileMenuOpen(false)}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2,
                                            py: 1,
                                            mb: 1,
                                            color: 'text.primary',
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                    
                                    <Button
                                        component={Link}
                                        to="/signup"
                                        fullWidth
                                        variant="contained"
                                        startIcon={<PersonAdd />}
                                        onClick={() => setMobileMenuOpen(false)}
                                        sx={{
                                            mx: 2,
                                            borderRadius: '25px',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </Box>
                    </motion.div>
                )}
            </Container>
        </AppBar>
    );
}

export default Navbar;