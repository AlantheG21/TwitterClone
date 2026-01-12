import { json } from 'express';
import {v2 as cloudinary} from 'cloudinary';
import Post from '../models/post.model.js'
import User from '../models/user.model.js';

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
export const likeUnlikePost = async (req, res) => {};
export const commentOnPost = async (req, res) => {};
export const deletePost = async (req, res) => {};