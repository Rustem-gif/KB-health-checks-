import { test, expect, request } from '@playwright/test';
import { MAIN_USER } from '../../src/Data/Users/mainUser';

test.describe('Health Check', () => {
  test('Login API health check', async ({ baseURL }) => {
    console.log('Running health check for login API...');
    
    // Create a new request context
    const apiRequest = await request.newContext({
      baseURL: baseURL,
      extraHTTPHeaders: {
        'Accept': 'application/vnd.s.v1+json',
        'Content-Type': 'application/json',
        'Origin': `${baseURL}`,
        'Referer': `${baseURL}/?sign-in=modal`
      }
    });

    console.log('Request context created with baseURL:', baseURL);

    // Login via API
    const response = await apiRequest.post('/api/users/sign_in', {
      data: {
        user: {
          email: MAIN_USER.email,
          password: MAIN_USER.password
        }
      }
    });

    console.log('API response status:', response.status());

    // Check response
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    console.log('API response body:', responseBody);
    expect(responseBody).toBeTruthy();
    
    console.log('Health check passed successfully!');
    
    // Clean up
    await apiRequest.dispose();
  });
});
