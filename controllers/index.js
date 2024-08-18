const router = require("express").Router();
const homeRoutes = require("./homeRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const userRoutes = require("./userRoutes");

router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);

router.use((req, res) => {
  res.status(404).send("Page not found!");
});

module.exports = router;
