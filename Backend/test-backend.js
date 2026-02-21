// Quick Backend Diagnostic Script
// Run with: node test-backend.js

console.log('🔍 Testing Backend Setup...\n');

// Test 1: Check Node version
console.log('1. Node Version:');
console.log('   ', process.version);
console.log('   ✅ Should be v16 or higher\n');

// Test 2: Check if required modules exist
console.log('2. Checking Dependencies:');
const requiredModules = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
    'cookie-parser',
    'cors',
    'socket.io',
    'cloudinary',
    'multer',
    'sharp'
];

let allModulesPresent = true;
requiredModules.forEach(module => {
    try {
        require.resolve(module);
        console.log(`   ✅ ${module}`);
    } catch (e) {
        console.log(`   ❌ ${module} - MISSING!`);
        allModulesPresent = false;
    }
});

if (!allModulesPresent) {
    console.log('\n⚠️  Some modules are missing. Run: npm install\n');
} else {
    console.log('\n✅ All dependencies installed\n');
}

// Test 3: Check .env file
console.log('3. Checking .env file:');
try {
    require('dotenv').config();
    const requiredEnvVars = ['MONGO_URI', 'SECRET_KEY', 'CLOUD_NAME', 'API_KEY', 'API_SECRET'];
    let allEnvPresent = true;
    
    requiredEnvVars.forEach(envVar => {
        if (process.env[envVar]) {
            console.log(`   ✅ ${envVar} is set`);
        } else {
            console.log(`   ❌ ${envVar} is MISSING!`);
            allEnvPresent = false;
        }
    });
    
    if (!allEnvPresent) {
        console.log('\n⚠️  Some environment variables are missing in .env file\n');
    } else {
        console.log('\n✅ All environment variables set\n');
    }
} catch (e) {
    console.log('   ❌ .env file not found or error reading it');
    console.log('   Error:', e.message, '\n');
}

// Test 4: Check file structure
console.log('4. Checking File Structure:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'server.js',
    'Controllers/UserController.js',
    'Controllers/PostController.js',
    'Controllers/MessageController.js',
    'Models/UserModel.js',
    'Models/PostModel.js',
    'Routes/UserRoute.js',
    'Routes/PostRoute.js',
    'middlewares/isAuthenticated.js'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - NOT FOUND!`);
    }
});

console.log('\n5. Testing MongoDB Connection:');
const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('   ✅ MongoDB connected successfully!');
            console.log('   Database:', mongoose.connection.name);
            mongoose.connection.close();
            console.log('\n✅ All tests passed! Backend should work.\n');
        })
        .catch((err) => {
            console.log('   ❌ MongoDB connection failed!');
            console.log('   Error:', err.message);
            console.log('\n⚠️  Fix MongoDB connection to proceed.\n');
        });
} else {
    console.log('   ❌ MONGO_URI not set in .env file\n');
}
