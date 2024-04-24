const router = require("express").Router();

router.get("/", (req, res, next) => {
  console.log('hello')
  res.json("All good in here");
});

module.exports = router;
