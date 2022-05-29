const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true, trim: true },
  isbn: { type: Number, required: true, trim: true, unique: true },
  type: { type: String, required: true, trim: true },
  publisher: { type: String, required: true },
  genre: { type: String, required: true },
  pages: { type: Number, required: true },
  author: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

comicSchema.statics.getComicsAsFiltered = async (reqBody) => {
  let query = { genre: reqBody.genre };

  if (reqBody.type) {
    query.type = reqBody.type;
  }

  if (reqBody.sort == "dateAdded")
    return await Comic.find(query).sort({ dateAdded: "desc" }).lean().exec();

  if (reqBody.sort == "pages")
    return await Comic.find(query).sort({ pages: "desc" }).lean().exec();
};

const Comic = mongoose.model("Comic", comicSchema);

module.exports = Comic;
