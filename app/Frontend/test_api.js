import axiosClient from './src/api/axiosClient.js';

// Simple test to check backend
const testBackend = async () => {
    try {
        console.log('🔍 Testing backend connection...');
        const response = await axiosClient.get('/auth/profile');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testBackend();
