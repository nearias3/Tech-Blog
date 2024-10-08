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

    console.log("Post data with comments:", post); 

    res.render("single-post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Render the edit form for a specific post
router.get("/post/:id/edit", withAuth, async (req, res) => {
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
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle the edit form submission
router.put("/post/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updatedPost[0] === 0) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Create a new comment
router.post("/post/:id/comment", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
