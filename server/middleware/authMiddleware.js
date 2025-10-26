const jwt = require('jsonwebtoken'); // Tool to read and verify tokens
const dotenv = require('dotenv'); // Loads secret keys from .env file
dotenv.config();

export const verifyToken = (req, res, next) => {
    try {
    const token = req.header('Authorization')?.split(" ")[1];
    /****What's happening:**
    - Users send the token in the **Authorization header** like this:
    ```
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    .split(" ") breaks it into: ["Bearer", "eyJhbGci..."]
    [1] grabs the actual token (the second part)
    ?. is optional chaining - prevents errors if Authorization doesn't exist */
    if(!token) {
        return res.status(403).json({ msg: 'Access Denied' });
    }

    // Verify the token
    const verifyToken = jwt.verify(token, process.env.JWTSECRET);
    req.user = verifyToken; // Attach user info (id, role) to request object
    next();

    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Invalid Token' });
    }
}