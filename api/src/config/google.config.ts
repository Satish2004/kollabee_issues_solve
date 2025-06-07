import { OAuth2Client } from "google-auth-library";

// Create and export the Google OAuth client
export const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri:
    process.env.NODE_ENV === "production"
      ? "https://kollabee.onrender.com/api/auth/google/callback"
      : "http://localhost:2000/api/auth/google/callback",
});

// Helper function to generate the Google OAuth URL
export const generateGoogleAuthUrl = (role: string) => {
  // Store role in state parameter
  const state = Buffer.from(JSON.stringify({ role })).toString("base64");

  return googleClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state,
  });
};
