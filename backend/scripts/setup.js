const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MWG Hostels Backend...\n');

// Create necessary directories
const directories = [
    'middleware',
    'models',
    'routes', 
    'utils',
    'controllers',
    'config',
    'uploads',
    'uploads/images',
    'uploads/documents',
    'uploads/avatars',
    'templates',
    'templates/emails',
    'socket',
    'scripts'
];

directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    } else {
        console.log(`✓ Directory already exists: ${dir}`);
    }
});

// Create .env file from .env.example if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
    console.log('⚠️  Please update the .env file with your actual configuration values');
} else if (fs.existsSync(envPath)) {
    console.log('✓ .env file already exists');
} else {
    console.log('❌ .env.example file not found');
}

// Create basic error handler middleware if it doesn't exist
const errorHandlerPath = path.join(__dirname, '..', 'middleware', 'errorHandler.js');
if (!fs.existsSync(errorHandlerPath)) {
    const errorHandlerContent = `const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message: message.join(', '), statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;`;

    fs.writeFileSync(errorHandlerPath, errorHandlerContent);
    console.log('✅ Created errorHandler middleware');
}

// Create basic notFound middleware if it doesn't exist
const notFoundPath = path.join(__dirname, '..', 'middleware', 'notFound.js');
if (!fs.existsSync(notFoundPath)) {
    const notFoundContent = `const notFound = (req, res, next) => {
    const error = new Error(\`Not Found - \${req.originalUrl}\`);
    res.status(404);
    next(error);
};

module.exports = notFound;`;

    fs.writeFileSync(notFoundPath, notFoundContent);
    console.log('✅ Created notFound middleware');
}

// Create README for backend
const readmePath = path.join(__dirname, '..', 'README.md');
if (!fs.existsSync(readmePath)) {
    const readmeContent = `# MWG Hostels Backend API

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your actual values
   \`\`\`

3. Start MongoDB (make sure MongoDB is running)

4. Run the server:
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

## API Endpoints

- **Auth**: \`/api/auth/*\`
- **Users**: \`/api/users/*\`
- **Properties**: \`/api/properties/*\`
- **Roommates**: \`/api/roommates/*\`
- **Bookings**: \`/api/bookings/*\`
- **Realtors**: \`/api/realtors/*\`
- **Reviews**: \`/api/reviews/*\`

## Features

- ✅ User authentication & authorization
- ✅ Student verification system
- ✅ Property management
- ✅ Roommate matching
- ✅ Real-time messaging
- ✅ Payment processing
- ✅ Email notifications
- ✅ File uploads
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling

## Environment Variables

See \`.env.example\` for all required environment variables.

## Database

This project uses MongoDB. Make sure MongoDB is installed and running.

## Documentation

API documentation available at: \`/api/docs\` (when implemented)
`;

    fs.writeFileSync(readmePath, readmeContent);
    console.log('✅ Created backend README.md');
}

console.log('\n🎉 Backend setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Make sure MongoDB is running');
console.log('3. Run: npm install');
console.log('4. Run: npm run dev');
console.log('\n🌐 Your API will be available at: http://localhost:5000/api');
console.log('📊 Health check: http://localhost:5000/api/health');