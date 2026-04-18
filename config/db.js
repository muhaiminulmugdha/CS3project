const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://muhtasimhaqinfo_db_user:JdUE8XTOBcR3UKT4@falconflow.yealgrq.mongodb.net/falconflowdb?appName=falconflow');
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;