const express = require("express");
// const { route, post } = require("./ticket.router");
const router = express.Router();

router.all("/", (req, res, next) => {
  res.json({ message: "return form ticket router" });

  next();
});

module.exports = router;
