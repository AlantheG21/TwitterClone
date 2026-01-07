import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
    try{
        const { username, fullName, email, password } = req.body;

        // Basic validation
        if(!username || !fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Simple email format validation

        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check for existing user with same email or username
        const existingUser = await User.findOne({ $or: [ { email }, { username } ] });

        // If a user exists, guard against null and check which field conflicts
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already in use" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already taken" });
            }
        }

        // Validate length and hash password
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const salt = await bcrypt.genSalt(10);  // Generate salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password (ex: "mypassword" -> "$2a$10$EixZaYVK1f")

        
        // Create user
        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res); // Generate token and set cookie
            await newUser.save(); // Save the new user to the database

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            });
        } else{ 
            // Mongoose validation failed
            res.status(400).json({error: "Invalid user data" });
        }
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    res.send('Login route');
}

export const logout = async (req, res) => {
    res.send('Logout route');
}