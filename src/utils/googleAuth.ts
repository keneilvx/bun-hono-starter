import { OAuth2Client } from 'google-auth-library';
import logger from '../config/logger';

// Get Google OAuth credentials from environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

// Initialize the OAuth2 client
const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * Generate a Google OAuth URL for authentication
 */
export function getGoogleAuthUrl(): string {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Force to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getGoogleTokens(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error: any) {
    logger.error(`Error getting Google tokens: ${error.message}`);
    throw new Error('Failed to get Google tokens');
  }
}

/**
 * Get user information from Google using the access token
 */
export async function getGoogleUserInfo(accessToken: string) {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    logger.error(`Error getting Google user info: ${error.message}`);
    throw new Error('Failed to get user information from Google');
  }
}

/**
 * Verify Google ID token
 */
export async function verifyGoogleIdToken(idToken: string) {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    return payload;
  } catch (error: any) {
    logger.error(`Error verifying Google ID token: ${error.message}`);
    throw new Error('Invalid Google ID token');
  }
}
