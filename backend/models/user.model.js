import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true    // Username must be unique
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true    // Email must be unique
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    followers: [    // List of user IDs who follow this user of type ObjectId referencing User model
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [] // Default to empty array
        }
    ],
    following: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            default: [] // Default to empty array
        }
    ], 
    profileImg: {
        type: String,
        default: "" // Default to empty string if no profile image is provided
    },
    coverImg: {
        type: String,
        default: "" // Default to empty string if no cover image is provided
    },
    bio: {
        type: String,
        default: "" // Default to empty string if no bio is provided
    },
    link: {
        type: String,
        default: "" // Default to empty string if no link is provided
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default: []
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;