import {
    AutoAwesome,
    Dashboard,
    Group,
    RocketLaunch,
    Security,
    Speed,
    TrendingUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const AnimatedSection = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
    const theme = useTheme();
    
    return (
        <AnimatedSection delay={delay}>
            <motion.div
                whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
            >
                <Card
                    sx={{
                        height: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                        backdropFilter: 'blur(10px)',
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
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                        '&:hover': {
                            boxShadow: `0 20px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                        }
                    }}
                >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                            }}
                        >
                            {React.cloneElement(icon, { 
                                sx: { fontSize: 40, color: 'white' } 
                            })}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatedSection>
    );
};

const StatCard = ({ number, label, delay = 0 }) => {
    const theme = useTheme();
    
    return (
        <AnimatedSection delay={delay}>
            <Paper
                sx={{
                    p: 4,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                    }}
                >
                    {number}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {label}
                </Typography>
            </Paper>
        </AnimatedSection>
    );
};

function LandingPage() {
    const theme = useTheme();

    const features = [
        
        {
            icon: <Dashboard />,
            title: "Interactive Dashboards",
            description: "Beautiful, real-time dashboards that make tracking progress and performance engaging and intuitive."
        },
        {
            icon: <Group />,
            title: "Team Collaboration",
            description: "Foster better team relationships with structured feedback loops and collaborative goal setting."
        },
        {
            icon: <Security />,
            title: "Privacy First",
            description: "Anonymous feedback options and enterprise-grade security to ensure safe, honest communication."
        } ,
        {
            icon: <Speed />,
            title: "Lightning Fast",
            description: "Optimized for speed with real-time updates and seamless user experience across all devices."
        }
    ];

    return (
        <Box sx={{ overflow: 'hidden' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.action.hover} 100%)`,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 50%),
                                   radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 50%)`,
                        pointerEvents: 'none',
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid span={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '4rem' },
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        mb: 3,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Transform Your Team's
                                    <br />
                                    Feedback Culture
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{ mb: 4, lineHeight: 1.6, fontWeight: 400 }}
                                >
                                    Empower your organization with intelligent feedback management, 
                                    real-time insights, and collaborative growth tools that drive success.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to="/signup"
                                            variant="contained"
                                            size="large"
                                            startIcon={<RocketLaunch />}
                                            sx={{
                                                px: 4,
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                borderRadius: '50px',
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                boxShadow: `0 10px 30px ${theme.palette.primary.main}40`,
                                                '&:hover': {
                                                    boxShadow: `0 15px 40px ${theme.palette.primary.main}60`,
                                                }
                                            }}
                                        >
                                            Get Started Free
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to="/login"
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Dashboard />}
                                            sx={{
                                                px: 4,
                                                py: 2,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                borderRadius: '50px',
                                                borderWidth: 2,
                                                '&:hover': {
                                                    borderWidth: 2,
                                                    background: `${theme.palette.primary.main}10`,
                                                }
                                            }}
                                        >
                                            View Demo
                                        </Button>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid span={{ xs: 12, md: 6 }}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '120%',
                                            height: '120%',
                                            background: `conic-gradient(from 0deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40, ${theme.palette.primary.main}40)`,
                                            borderRadius: '50%',
                                            animation: 'rotate 20s linear infinite',
                                            zIndex: -1,
                                        }
                                    }}
                                >
                                    <Paper
                                        elevation={20}
                                        sx={{
                                            p: 4,
                                            borderRadius: '24px',
                                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                            backdropFilter: 'blur(20px)',
                                            border: `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <Grid container spacing={3}>
                                            <Grid span={{ xs: 6 }}>
                                                <StatCard number="98%" label="User Satisfaction" delay={0.3} />
                                            </Grid>
                                            <Grid span={{ xs: 6 }}>
                                                <StatCard number="50%" label="Faster Reviews" delay={0.4} />
                                            </Grid>
                                            <Grid span={{ xs: 6 }}>
                                                <StatCard number="10K+" label="Active Users" delay={0.5} />
                                            </Grid>
                                            <Grid span={{ xs: 6 }}>
                                                <StatCard number="24/7" label="Support" delay={0.6} />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 12 }}>
                <AnimatedSection>
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '2rem', md: '3rem' },
                                fontWeight: 700,
                                mb: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Powerful Features for Modern Teams
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Everything you need to build a thriving feedback culture and drive continuous improvement
                        </Typography>
                    </Box>
                </AnimatedSection>
                </Container>
                <Container maxWidth="xl" sx={{ py: 12 }}>
    <Grid container spacing={3} justifyContent="center">
        {features.slice(0, 4).map((feature, index) => (
            <Grid span={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ height: '100%' }}>
                    <FeatureCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        delay={index * 0.1}
                    />
                </Box>
            </Grid>
        ))}
    </Grid>
</Container>




          

            {/* CTA Section */}
            <Box
                sx={{
                    py: 12,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
                    position: 'relative',
                }}
            >
                <Container maxWidth="md">
                    <AnimatedSection>
                        <Box sx={{ textAlign: 'center' }}>
                            <AutoAwesome sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Ready to Transform Your Team?
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                                Join thousands of teams already using our platform to build better feedback cultures
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    component={RouterLink}
                                    to="/signup"
                                    variant="contained"
                                    size="large"
                                    startIcon={<TrendingUp />}
                                    sx={{
                                        px: 6,
                                        py: 2,
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        borderRadius: '50px',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        boxShadow: `0 15px 40px ${theme.palette.primary.main}40`,
                                        '&:hover': {
                                            boxShadow: `0 20px 50px ${theme.palette.primary.main}60`,
                                        }
                                    }}
                                >
                                    Start Your Free Trial
                                </Button>
                            </motion.div>
                        </Box>
                    </AnimatedSection>
                </Container>
            </Box>
        </Box>
    );
}

export default LandingPage;