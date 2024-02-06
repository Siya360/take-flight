// apiKeyValidator.js
const validApiKey = process.env.REACT_APP_API_KEY; // The API key is stored in an environment variable

const validateApiKey = (req, res, next) => {
  const apiKey = req.get('x-api-key'); // Or req.headers['x-api-key']
  if (apiKey && apiKey === validApiKey) {
    return next(); // API key is valid, proceed to the next middleware/route handler
  } else {
    return res.status(401).json({ error: 'Unauthorized' }); // API key is invalid, return an error
  }
};

module.exports = validateApiKey;
