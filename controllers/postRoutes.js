const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Get a single post by its ID
router.get("/post/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
        ],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    const post = postData.get({ plain: true });

    console.log("Post data with comments:", post); // Delete this later

    res.render("single-post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Create a new comment
router.post("/post/:id/comment", withAuth, async (req, res) => {
  try {
    console.log("Request body:", req.body); // Delete this later
    console.log("User ID:", req.session.user_id); // Delete this later

    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    console.log("Comment created:", newComment); // Delete this later

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    console.error("Error creating comment:", err); // Delete this later
    res.status(500).json(err);
  }
});

module.exports = router;
