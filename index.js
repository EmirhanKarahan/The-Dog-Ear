require("dotenv").config();
const express = require("express");
const expressHandlebars = require("express-handlebars");
const path = require("path");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");

require("./db/moongose");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "public");

app.engine("handlebars", expressHandlebars.engine());
app.set("view engine", "handlebars");

app.use(
  expressSession({
    secret: "friedpatates",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", "./views");
app.use(express.static(publicDirectoryPath));
app.listen(PORT, console.log("Server has started at port: " + PORT));

//-----------------
//------ROUTES-----
const authRouter = require("./routes/auth");
const comicRouter = require("./routes/comic");
const mainRouter = require("./routes/main");
const Comic = require("./models/comic");

app.use(mainRouter);
app.use(authRouter);
app.use(comicRouter);

app.get("*", function (req, res) {
  res.status(404).render("404");
});
