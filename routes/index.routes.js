const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Login through Google mail, you cheeky monkey... ;)");
});

module.exports = router;
