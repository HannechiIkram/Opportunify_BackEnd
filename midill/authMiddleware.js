const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authMiddleware = (req, res, next) => {

const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log(jwtSecret);

    const accessToken = req.headers.authorization; // Extract access token from request headers

    // Check if access token exists and is in the correct format
    if (!accessToken || typeof accessToken !== 'string') {
        return res.status(401).json({ error: 'Invalid access token format' });
    }

    // Split the token into its parts
    const tokenParts = accessToken.split(' ');

    // Verify if the token has three parts
    if (tokenParts.length !== 2) {
        return res.status(401).json({ error: 'Invalid access token format' });
    }

    const token = tokenParts[1]; // Extract the actual token part

    // Verify token validity and decode its payload
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // Token is valid, proceed to the next middleware or route handler
        req.user = decodedToken; // Optionally, attach decoded token to the request object
        next();
    } catch (error) {
        // Token verification failed (e.g., invalid token)
        return res.status(401).json({ error: 'Invalid access token' });
    }
};

module.exports = authMiddleware;
