const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  console.log('hello')
  res.json("profile");
});

module.exports = router;