// Test script for new registration API
// Run this in browser console or Node.js

const testRegistration = async () => {
    const baseURL = 'http://localhost:5000/api/v1'; // Adjust port as needed
    
    const testUser = {
        username: 'selene.moss43',
        password: 'password123',
        name: 'Selene Moss',
        email: 'selene.moss43@thecyclesolutions.com',
        phone: '+1234567890',
        address: '123 Main Street, City, State, Country'
    };

    try {
        console.log('Testing user registration...');
        console.log('User data:', testUser);
        
        const response = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Registration successful!');
            console.log('Response:', result);
            
            // Display user info in the format requested
            const user = result.user;
            console.log('\n📋 User Information:');
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email || 'N/A'}`);
            console.log(`Phone: ${user.phone || 'N/A'}`);
            console.log(`Address: ${user.address || 'N/A'}`);
            console.log(`Role: ${user.role}`);
            console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`);
            console.log(`Member Since: ${new Date(user.createdAt).toLocaleDateString()}`);
        } else {
            console.log('❌ Registration failed!');
            console.log('Error:', result.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
};

// Test login with the new user
const testLogin = async () => {
    const baseURL = 'http://localhost:5000/api/v1';
    
    const loginData = {
        username: 'selene.moss43',
        password: 'password123'
    };

    try {
        console.log('\nTesting user login...');
        
        const response = await fetch(`${baseURL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Login successful!');
            console.log('Access Token:', result.accessToken);
            console.log('Refresh Token:', result.refreshToken);
            
            // Display user info
            const user = result.user;
            console.log('\n📋 User Information:');
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email || 'N/A'}`);
            console.log(`Phone: ${user.phone || 'N/A'}`);
            console.log(`Address: ${user.address || 'N/A'}`);
            console.log(`Role: ${user.role}`);
            console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`);
            console.log(`Member Since: ${new Date(user.createdAt).toLocaleDateString()}`);
        } else {
            console.log('❌ Login failed!');
            console.log('Error:', result.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
};

// Test admin creation
const testAdminCreation = async () => {
    const baseURL = 'http://localhost:5000/api/v1';
    
    const adminData = {
        username: 'admin',
        password: 'admin123',
        name: 'System Administrator',
        email: 'admin@thecyclesolutions.com',
        phone: '+1234567890',
        address: 'Admin Office, Company Building'
    };

    try {
        console.log('\nTesting admin creation...');
        
        const response = await fetch(`${baseURL}/seed-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Admin creation successful!');
            console.log('Response:', result.message);
            
            // Display admin info
            const user = result.user;
            console.log('\n📋 Admin Information:');
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email || 'N/A'}`);
            console.log(`Phone: ${user.phone || 'N/A'}`);
            console.log(`Address: ${user.address || 'N/A'}`);
            console.log(`Role: ${user.role}`);
            console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`);
            console.log(`Member Since: ${new Date(user.createdAt).toLocaleDateString()}`);
        } else {
            console.log('❌ Admin creation failed!');
            console.log('Error:', result.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('🚀 Starting API Tests...\n');
    
    await testRegistration();
    await testLogin();
    await testAdminCreation();
    
    console.log('\n✅ All tests completed!');
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testRegistration, testLogin, testAdminCreation, runAllTests };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    console.log('API Test Script loaded. Run runAllTests() to start testing.');
}
