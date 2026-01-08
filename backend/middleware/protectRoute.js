import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

/*
    Understanding protectRoute Middleware:
    This middleware function is designed to protect certain routes by ensuring that only authenticated users can access them.
    It checks for a valid JWT token in the request cookies, verifies it, and attaches the corresponding user to the request object.
    If the token is missing or invalid, it responds with a 401 Unauthorized status.

    - next: Function to pass control to the next middleware or route handler. (ex: getMe controller on line 6 of auth.routes.js)
*/
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Retrieve token from cookies
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token validity

        if(!decoded){
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Fetch user without password
        
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User Not Found" });
        }
        
        req.user = user; // Attach user to request object (req.user field was created here)
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}