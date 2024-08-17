const router = require("express").Router();
const homeRoutes = require("./homeRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const userRoutes = require("./userRoutes");

router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/", userRoutes);

module.exports = router;
