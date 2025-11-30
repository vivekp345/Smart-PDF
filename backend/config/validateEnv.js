/**
 * Checks if all required environment variables are set.
 * If any are missing, it stops the server immediately.
 */
export const validateEnv = () => {
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GEMINI_API_KEY'
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missingVars.forEach((key) => console.error(`   - ${key}`));
    console.error('   Please check your .env file.');
    process.exit(1); // Kill the server process with error code 1
  }
};