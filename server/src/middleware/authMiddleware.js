const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

// Get the Cognito User Pool ID and Region from environment variables
const COGNITO_POOL_ID = process.env.COGNITO_POOL_ID;
const COGNITO_REGION = process.env.COGNITO_REGION;

// Construct the Cognito issuer URL
const COGNITO_ISSUER = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_POOL_ID}`;

let pems = {};

// Fetch the JWKs from Cognito and convert them to PEM format
const fetchJWKs = async () => {
    const url = `${COGNITO_ISSUER}/.well-known/jwks.json`;
    const response = await axios.get(url);
    const jwks = response.data.keys;

    jwks.forEach(jwk => {
        pems[jwk.kid] = jwkToPem(jwk);
    });
};

// Initialize JWKs
fetchJWKs().catch(console.error);

// Middleware function to validate the JWT token
const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'No token provided.' });
        }

        const decodedToken = jwt.decode(token, { complete: true });
        if (!decodedToken) {
            return res.status(401).send({ message: 'Invalid token.' });
        }

        const pem = pems[decodedToken.header.kid];
        if (!pem) {
            return res.status(401).send({ message: 'Invalid token.' });
        }

        jwt.verify(token, pem, { issuer: COGNITO_ISSUER }, (err, payload) => {
            if (err) {
                return res.status(401).send({ message: 'Unauthorized.' });
            }
            req.user = payload;
            next();
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

module.exports = {
    validateToken
};