const mongoose = require('mongoose');

const MONGODB_URL = 'mongodb+srv://hedtjyuzon:TyEtUWolJcbgFvcP@techguru.plruilc.mongodb.net/TechGuru_Product?retryWrites=true&w=majority&appName=TechGuru';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB - Product Service');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    MONGODB_URL
}; 