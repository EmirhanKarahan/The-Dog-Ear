const Comic = require("../models/comic");
const User = require("../models/user");
const { UserRating } = require("../models/user-rating");

const comicView = async (req, res, next) => {
  let comicId = req.params.id;
  let userId = req.session.userId;
  let user;
  if (!!userId) {
    user = await User.findOne({ _id: userId }).lean().exec();
  }
  try {
    const comic = await Comic.findOne({ _id: comicId }).exec();
    const userRating = await UserRating.findOne({
      userId: req.session.userId,
      comicId: comic._id,
    }).exec();
    let ratings = {};
    if (userRating) {
      ratings = { status: userRating.status, stars: userRating.stars };
    }
    const comicStars = await UserRating.getComicStars(comicId);
    if (comic)
      res.render("comic", {
        layout: "filled",
        loggedIn: req.session.userId,
        comic: comic.toObject(),
        ...ratings,
        comicStars,
        user,
      });
    else res.render("404");
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

const comicController = async (req, res, next) => {
  let comicId = req.params.id;
  let userId = req.session.userId;

  if (req.body.status == "none") {
    await UserRating.findOneAndDelete({ comicId, userId });
    return res.redirect("back");
  }

  const userRating = await UserRating.findOneAndUpdate(
    { comicId, userId },
    { status: req.body.status, stars: req.body.stars }
  );

  if (!userRating) {
    const userRating = new UserRating({
      userId,
      comicId,
      status: req.body.status,
      stars: req.body.stars,
    });
    await userRating.save();
  }

  res.redirect("back");
};

module.exports = {
  comicView,
  comicController,
};
