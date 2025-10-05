// 
import express from 'express';
import Post from '../mongodb/models/post.js';

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});
router.route('/').post(async (req, res) => {
  try {
    const { name,photo } = req.body;

    const newPost = await Post.create({
      name,
      photo: photo 
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

export default router;
