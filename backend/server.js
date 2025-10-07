const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const roommateRoutes = require('./routes/roommates');
const bookingRoutes = require('./routes/bookings');
const realtorRoutes = require('./routes/realtors');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const paymentRoutes = require('./routes/payments');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:8000',
        'http://localhost:3000',
        'https://mwghostels.vercel.app',
        'https://www.mwghostels.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW || 15) * 60 / 60) + ' minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mwg_hostels', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/realtors', realtorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'MWG Hostels API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// API Info endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Welcome to MWG Hostels API',
        version: '1.0.0',
        description: 'Backend API for student accommodation and roommate finder platform',
        author: 'SAMA GREAT',
        documentation: '/api/docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            properties: '/api/properties',
            roommates: '/api/roommates',
            bookings: '/api/bookings',
            realtors: '/api/realtors',
            reviews: '/api/reviews',
            admin: '/api/admin',
            upload: '/api/upload',
            payments: '/api/payments'
        }
    });
});

// Serve static files (uploaded images, documents)
app.use('/uploads', express.static('uploads'));

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Socket.IO for real-time messaging
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: [
            'http://localhost:8000',
            'http://localhost:3000',
            'https://mwghostels.vercel.app'
        ],
        methods: ['GET', 'POST']
    }
});

// Socket.IO connection handling
require('./socket/socketHandler')(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 MWG Hostels API Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💬 Socket.IO enabled for real-time messaging`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('🛑 Process terminated');
        mongoose.connection.close();
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('🛑 Process terminated');
        mongoose.connection.close();
    });
});

module.exports = app;