import {v2 as cloudinary} from 'cloudinary';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

export const getAllPosts = async (req,res) => {
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        if(posts.length === 0) return res.status(200).json([]);

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ error: "User not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const createPost = async (req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        
        const user = await User.findById(req.user._id)

        if(!user) return res.status(404).json({ error: "User not found" });

        if(!text && !img) return res.status(400).json({ error: "Post must have text or image" });

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            img
        })

        await newPost.save();
        res.status(201).json({ message: "Post uploaded successfully", data: newPost });



    } catch (error) {
        console.log("Error in createPost controller: ", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const likeUnlikePost = async (req, res) => {
    /*
        The id param will be the Post Object ID
        Will check if the user has already liked said post (if not, unlike and vice versa)
        Update Post.likes array by appending user's ID that liked the post
    */
    const { id } = req.params
    const userId = req.user._id

    try {
        const post = await Post.findById(id)

        if(!post) return res.status(404).json({ error: "Post not found" });
        if(post.user.equals(userId)) return res.status(404).json({ error: "Cannot like your own post" });

        const hasLiked = post.likes.includes(userId.toString())

        if(!hasLiked){
            await Post.findByIdAndUpdate(id, { $push: { likes: userId} });
            await User.findByIdAndUpdate(userId, { $push: { likedPosts: id } });

            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            })

            await newNotification.save();

            res.status(200).json({ message: "Liked post successfuly" })
        }
        else{
            await Post.findByIdAndUpdate(id, { $pull: { likes: userId} });
            await User.findByIdAndUpdate(userId, { $pull: { likedPosts: id } });
            res.status(200).json({ message: "Unliked post successfuly" })
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id

        if(!text) return res.status(404).json({ error: "Text field is required" });

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({ error: "Post not found" });

        const comment = {user: userId, text};

        post.comments.push(comment)

        await post.save();
        res.status(200).json({ message: "Commented successfully", comment });
    } catch (error) {
        console.log("Error in commentOnPost controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) return res.status(404).json({ error: "Post not found" });

        if(!post.user.equals(req.user._id)) return res.status(401).json({ error: "You are not authorized to delete this post" });

        if(post.img){
            const img = post.img.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(img);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in deletePost controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};