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

// Route to render the edit post page
router.get("/edit-post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    const post = postData.get({ plain: true });

    res.render("edit-post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to handle the edit post form submission
router.post("/edit-post/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedPost) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to handle the deletion of a post
router.post("/delete-post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.redirect("/dashboard");
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
