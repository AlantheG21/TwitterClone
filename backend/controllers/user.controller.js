import User from '../models/user.model.js';
import Notification from '../models/notification.model.js'

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

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params; // ID of the user to follow
    const loggedInUser = req.user; // User making the request
    console.log(`UserId ${loggedInUser._id} is attempting to follow user with ID: ${id}`);

    /*
        Most optimal way to perform follow/unfollow operation (I think):
        1. Check if id passed belongs to loggedInUser - prevent self-follow/unfollow
        2. Check if user with given id exists
        3. If not, check if loggedInUser is already following the user with the given id
        4. If not following, add to following and followers lists respectively
        5. If already following, unfollow by removing from lists

        This way we minimize the number of database calls and ensure data consistency.
    */
    try {
        if(id === String(loggedInUser._id)){
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        const targetUser = await User.findById(id);

        if(!targetUser){
            return res.status(404).json({ error: "User to follow/unfollow not found" });
        }

        const isFollowing = loggedInUser.following.includes(targetUser._id);
        console.log(`Is user ${loggedInUser._id} already following target user?`, isFollowing);

        if(!isFollowing){
            // Follow user
            console.log(`Following user with ID: ${targetUser._id}`);
            await User.findByIdAndUpdate(loggedInUser._id, { $push: { following: targetUser._id } });
            await User.findByIdAndUpdate(targetUser._id, { $push: { followers: loggedInUser._id } });

            // Send a notification to target user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: targetUser._id
            });

            await newNotification.save();
            
            res.status(200).json({ message: "User followed successfully"})
        } else{
            // Unfollow user
            console.log(`Unfollowing user with ID: ${targetUser._id}`);
            await User.findByIdAndUpdate(loggedInUser._id, { $pull: { following: targetUser._id} });
            await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: loggedInUser._id} });

            res.status(200).json({ message: "User unfollowed successfully"})

        }

    } catch (error) {
        console.log("Error in followUser controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserProfile = async (req, res) => {}