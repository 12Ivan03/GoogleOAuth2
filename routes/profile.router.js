const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.json("profile");
});

module.exports = router;