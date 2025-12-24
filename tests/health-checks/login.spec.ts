import { test, expect, request } from '@playwright/test';
import { MAIN_USER } from '../../src/Data/Users/mainUser';
import { expectedResult } from '../../src/Data/expectedResult/expectedResult';

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
    console.log('Response headers:', response.headers());
    console.log('Response URL:', response.url());

    // Check response
    if (response.status() !== 201) {
      const responseText = await response.text();
      console.error('Failed to sign in via API. Response body:', responseText);
      throw new Error(`Failed to sign in via API. Status: ${response.status()}`);
    }

    console.log('API login successful, status:', response.status());

    const responseBody = await response.json();
    const purifiedResponseBody = () => {
      delete responseBody.current_sign_in_at;
      return responseBody;
    }
    console.log('API response body:', responseBody);
    expect(responseBody).toEqual(expectedResult);
    
    console.log('Health check passed successfully!');
    
    // Clean up
    await apiRequest.dispose();
  });
});
