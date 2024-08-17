const router = require("express").Router();
const Post = require("C:/Users/nicol/tech-blog/models/Post");
const User = require("C:/Users/nicol/tech-blog/models/User");
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

module.exports = router;
