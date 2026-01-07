import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/*
    Generates a JWT token for the given user ID and sets it as an HTTP-only cookie in the response.

    - userId: The ID of the user for whom the token is generated.
    - res: The Express response object to set the cookie.

    jwt.sign(): Creates a JWT token with the user ID as payload, signed with a secret key and an expiration time of 7 days.
    res.cookie(): Sets the JWT token as an HTTP-only cookie with security options to prevent XSS and CSRF attacks.
*/
export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d' // Token valid for 15 days
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie valid for 15 days
        httpOnly: true, // Prevent XSS attacks
        sameSite: "strict", // Prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development" // Only send over HTTPS in production
    });
}