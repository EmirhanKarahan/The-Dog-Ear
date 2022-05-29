const express = require("express");
const router = express.Router();
const Comic = require("../models/comic");
const User = require("../models/user");
const { UserRating } = require("../models/user-rating");

router.get("/", async (req, res) => {
  let userId = req.session.userId;
  let user;
  let featuredComics;
  if (!!userId) {
    user = await User.findOne({ _id: userId }).lean().exec();
    featuredComics = await UserRating.getRecommendations(userId);
  } else {
    featuredComics = await Comic.find({}).limit(6).lean().exec();
  }
  const lastlyAdded = await Comic.find({})
    .limit(8)
    .sort({ dateAdded: -1 })
    .lean()
    .exec();
  res.render("home", {
    layout: "filled",
    loggedIn: !!userId,
    featuredComics,
    lastlyAdded,
    user,
  });
});

router.post("/", async (req, res) => {
  let userId = req.session.userId;
  let user;
  let featuredComics;
  if (!!userId) {
    user = await User.findOne({ _id: userId }).lean().exec();
    featuredComics = await UserRating.getRecommendations(userId);
  } else {
    featuredComics = await Comic.find({}).limit(6).lean().exec();
  }
  const lastlyAdded = await Comic.find({})
    .limit(8)
    .sort({ dateAdded: -1 })
    .lean()
    .exec();

  const searchResults = await Comic.getComicsAsFiltered(req.body);

  res.render("home", {
    layout: "filled",
    loggedIn: !!userId,
    featuredComics,
    lastlyAdded,
    user,
    searchResults,
  });
});

router.get("/profile", async (req, res) => {
  let userId = req.session.userId;
  if (!userId) return res.redirect("/login");
  let user = await User.findOne({ _id: userId }).lean().exec();
  let plantoreadData = await UserRating.find(
    {
      userId,
      status: "plantoread",
    },
    "comicId"
  )
    .populate("comicId")
    .lean()
    .exec();
  let plantoread = plantoreadData.map((obj) => ({
    comicId: obj.comicId._id,
    comicName: obj.comicId.name,
  }));

  let readingData = await UserRating.find(
    {
      userId,
      status: "reading",
    },
    "comicId"
  )
    .populate("comicId")
    .lean()
    .exec();
  let reading = readingData.map((obj) => ({
    comicId: obj.comicId._id,
    comicName: obj.comicId.name,
  }));
  let finishedData = await UserRating.find(
    {
      userId,
      status: "finished",
    },
    "comicId"
  )
    .populate("comicId")
    .lean()
    .exec();
  let finished = finishedData.map((obj) => ({
    comicId: obj.comicId._id,
    comicName: obj.comicId.name,
  }));

  res.render("profile", {
    layout: "filled",
    loggedIn: req.session.userId,
    plantoread,
    reading,
    finished,
    user,
  });
});

router.post("/search", async (req, res) => {
  const regex = new RegExp(`${req.body.search}`, "i");
  let userId = req.session.userId;
  let user;
  if (!!userId) {
    user = await User.findOne({ _id: userId }).lean().exec();
  }
  let searchedComics = await Comic.find({ name: regex }).limit(5).lean().exec();
  res.render("search", {
    layout: "filled",
    loggedIn: req.session.userId,
    searchedComics,
    user,
  });
});

module.exports = router;
