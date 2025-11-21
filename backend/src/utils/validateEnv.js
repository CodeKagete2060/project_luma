const requiredKeys = ['MONGODB_URI', 'JWTSECRET'];

function validateEnv() {
  const missing = requiredKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = { validateEnv };

