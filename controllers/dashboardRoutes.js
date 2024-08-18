const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const withAuth = require("../utils/auth");

// Get all posts for logged-in user
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render the create new post page
router.get("/new-post", withAuth, (req, res) => {
  res.render("new-post", {
    logged_in: req.session.logged_in,
  });
});

/// Handle form submission for creating a new post
router.post("/new-post", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
      date_created: new Date(),
    });

    // Redirect back to the dashboard after creating the post
    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
