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

export const followUser = async (req, res) => {}

export const unfollowUser = async (req, res) => {}

export const updateUserProfile = async (req, res) => {}