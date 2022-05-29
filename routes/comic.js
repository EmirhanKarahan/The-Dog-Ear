const express = require("express");
const router = express.Router();
const {
  comicView,
  comicController,
  filterComicController,
} = require("../controllers/comic");

router.get("/comic/:id", comicView);

router.post("/comic/:id", comicController);

module.exports = router;
