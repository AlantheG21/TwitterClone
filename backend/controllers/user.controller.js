import User from '../models/user.model.js';

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    console.log("Fetching profile for username:", username);

    try {
        if(req.user.username === username){ // If the requested profile is the logged-in user's profile, return req.user
            res.status(200).json(req.user);
        }
        else{ // Fetch other user's profile from the database
            const user = await User.findOne({ username }).select("-password");

            if(!user){
                return res.status(404).json({ error: "User Not Found" });
            }
            res.status(200).json(user);
        }
    } catch (error) {
        console.log("Error in getUserProfile controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getSuggestedUsers = async (req, res) => {}

export const followUser = async (req, res) => {
    const { id } = req.params; // ID of the user to follow
    const loggedInUser = req.user; // User making the request
    console.log(`User ${loggedInUser.username} is attempting to follow user with ID: ${id}`);

    try {
        const userToFollow = await User.findById(id);

        // Check if the user to follow exists
        if (!userToFollow) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent users from following themselves
        if (userToFollow._id.equals(loggedInUser._id)) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        // Check if the user is already following
        if (loggedInUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ error: "You are already following this user" });
        }

        // Add to following list
        loggedInUser.following.push(userToFollow._id);
        await loggedInUser.save();

        // Add to followers list
        userToFollow.followers.push(loggedInUser._id);
        await userToFollow.save();

        res.status(200).json({ message: "Successfully followed user" });
    } catch (error) {
        console.log("Error in followUser controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const unfollowUser = async (req, res) => {}

export const updateUserProfile = async (req, res) => {}