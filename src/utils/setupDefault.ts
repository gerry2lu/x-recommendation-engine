import { passport } from "@imtbl/sdk";
import { config } from "@imtbl/sdk";

export const passportInstance = new passport.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX, // or config.Environment.PRODUCTION
    publishableKey:
      process.env.NEXT_PUBLIC_PUBLISHABLE_KEY || "<YOUR_PUBLISHABLE_KEY>", // replace with your publishable API key from Hub
  },
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "<YOUR_CLIENT_ID>", // replace with your client ID from Hub
  redirectUri: "https://x-recommendation-engine.vercel.app/redirect", // replace with one of your redirect URIs from Hub
  logoutRedirectUri: "https://x-recommendation-engine.vercel.app/", // replace with one of your logout URIs from Hub
  // redirectUri: "http://localhost:3000/redirect", // replace with one of your redirect URIs from Hub
  // logoutRedirectUri: "http://localhost:3000/", // replace with one of your logout URIs from Hub
  audience: "platform_api",
  scope: "openid offline_access email transact",
});
