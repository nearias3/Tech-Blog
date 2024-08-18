const router = require("express").Router();
const User = require("../models/User");

// Render the sign-up page
router.get("/signup", (req, res) => {
  res.render("signup"); 
});

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.redirect("/"); // Redirect to the homepage after successful signup
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      // Redirect back to the signup page with an error message
      res.status(400).render("signup", {
        errorMessage: "Username already exists, please choose another one.",
      });
    } else {
      res.status(500).json(err);
    }
  }
});

// Render the login page
router.get("/login", (req, res) => {
  res.render("login"); 
});

// Login
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res
        .status(400)
        .render("login", {
          errorMessage: "Incorrect username or password, please try again.",
        });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .render("login", {
          errorMessage: "Incorrect username or password, please try again.",
        });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.redirect("/dashboard"); // Redirect to the dashboard after successful login
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout
router.get("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/"); 
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
