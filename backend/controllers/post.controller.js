import {v2 as cloudinary} from 'cloudinary';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

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
            await Post.findByIdAndUpdate(id, { $push: { likes: userId} })

            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: 'like'
            })

            await newNotification.save();

            res.status(200).json({ message: "Liked post successfuly" })
        }
        else{
            await Post.findByIdAndUpdate(id, { $pull: { likes: userId} })
            res.status(200).json({ message: "Unliked post successfuly" })
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
};
export const commentOnPost = async (req, res) => {};
export const deletePost = async (req, res) => {};