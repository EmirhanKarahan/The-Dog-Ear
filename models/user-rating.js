const mongoose = require("mongoose");
const validator = require("validator");
const Comic = require("./comic");
const Schema = mongoose.Schema;

const userRatingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  comicId: { type: Schema.Types.ObjectId, required: true, ref: "Comic" },
  status: { type: String, required: true },
  stars: { type: Number, required: true },
});

userRatingSchema.statics.getComicStars = async function (comicId, callback) {
  let total = 0;
  const userRatings = await UserRating.find({ comicId }, "stars");
  if (userRatings.length <= 0) {
    return 0;
  }
  userRatings.forEach((userRating) => {
    total += userRating.stars;
  });
  return Math.floor(total / userRatings.length);
};

userRatingSchema.statics.getRecommendations = async function (
  userId,
  callback
) {
  let recommendedComics = [];
  let lovedGenres = [];
  const userRatings = await UserRating.find({ userId }, "stars comicId")
    .populate("comicId")
    .sort({ stars: "desc" })
    .limit(5);

  for (const obj of userRatings) {
    if (!lovedGenres.includes(obj.comicId.genre)) {
      lovedGenres.push(obj.comicId.genre);
    }
  }

  for (const genre of lovedGenres) {
    let temp = await Comic.find({ genre }).limit(3).lean().exec();
    recommendedComics.push(...temp);
  }

  return recommendedComics;
};

const UserRating = mongoose.model("UserRating", userRatingSchema);

module.exports = { UserRating };
