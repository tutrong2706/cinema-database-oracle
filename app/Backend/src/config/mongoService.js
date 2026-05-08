import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'cinema_db';

let mongoClient = null;
let mongoDb = null;

/**
 * Kết nối đến MongoDB
 */
export async function connectMongo() {
    try {
        mongoClient = new MongoClient(MONGO_URI);
        await mongoClient.connect();
        mongoDb = mongoClient.db(DB_NAME);
        console.log('✅ MongoDB connected!');
        return mongoDb;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

/**
 * Lấy database instance
 */
export function getMongoDb() {
    if (!mongoDb) {
        throw new Error('MongoDB not connected. Call connectMongo() first.');
    }
    return mongoDb;
}

/**
 * Đóng kết nối MongoDB
 */
export async function disconnectMongo() {
    if (mongoClient) {
        await mongoClient.close();
        console.log('MongoDB disconnected');
    }
}
