const router = require("express").Router();
const homeRoutes = require("./homeRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes"); 

router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/", postRoutes);

router.use((req, res) => {
  res.status(404).send("Page not found!");
});

module.exports = router;
