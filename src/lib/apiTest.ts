// Railway API Connection Test
// Run this in browser console or create a test page to verify API connectivity

import { railwayApi } from './railwayApi';

// Test API connectivity
export const testRailwayConnection = async () => {
  console.log('🚂 Testing Railway API Connection...');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const healthResult = await railwayApi.healthCheck();
    console.log('Health Check Result:', healthResult);
    
    if (healthResult.success) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', healthResult.error);
    }
    
    // Test 2: Registration Test (use a test email)
    console.log('2️⃣ Testing registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    
    const registerResult = await railwayApi.register(
      testEmail,
      testPassword,
      'Test',
      'User'
    );
    
    console.log('Registration Result:', registerResult);
    
    if (registerResult.success) {
      console.log('✅ Registration successful');
      
      // Test 3: Login Test
      console.log('3️⃣ Testing login...');
      const loginResult = await railwayApi.login(testEmail, testPassword);
      console.log('Login Result:', loginResult);
      
      if (loginResult.success) {
        console.log('✅ Login successful');
        
        // Test 4: Get Current User
        console.log('4️⃣ Testing get current user...');
        const userResult = await railwayApi.getCurrentUser();
        console.log('User Result:', userResult);
        
        if (userResult.success) {
          console.log('✅ Get user successful');
        } else {
          console.log('❌ Get user failed:', userResult.error);
        }
        
        // Test 5: Get Personas (should be empty for new user)
        console.log('5️⃣ Testing get personas...');
        const personasResult = await railwayApi.getPersonas();
        console.log('Personas Result:', personasResult);
        
        if (personasResult.success) {
          console.log('✅ Get personas successful');
        } else {
          console.log('❌ Get personas failed:', personasResult.error);
        }
        
        // Test 6: Logout
        console.log('6️⃣ Testing logout...');
        const logoutResult = await railwayApi.logout();
        console.log('Logout Result:', logoutResult);
        
        if (logoutResult.success) {
          console.log('✅ Logout successful');
        } else {
          console.log('❌ Logout failed:', logoutResult.error);
        }
      } else {
        console.log('❌ Login failed:', loginResult.error);
      }
    } else {
      console.log('❌ Registration failed:', registerResult.error);
    }
    
    console.log('🎉 Railway API test completed!');
    
  } catch (error) {
    console.error('🚨 Railway API test failed with exception:', error);
  }
};

// Quick health check function
export const quickHealthCheck = async () => {
  try {
    const result = await railwayApi.healthCheck();
    console.log('Railway API Health:', result.success ? '✅ Online' : '❌ Offline');
    return result.success;
  } catch (error: any) {
    console.log('Railway API Health: ❌ Error -', error?.message || 'Unknown error');
    return false;
  }
};

// Type augmentation for window object
declare global {
  interface Window {
    testRailwayConnection: typeof testRailwayConnection;
    quickHealthCheck: typeof quickHealthCheck;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testRailwayConnection = testRailwayConnection;
  window.quickHealthCheck = quickHealthCheck;
  console.log('🔧 Railway API test functions loaded:');
  console.log('- testRailwayConnection(): Run full API test');
  console.log('- quickHealthCheck(): Quick health check');
}
