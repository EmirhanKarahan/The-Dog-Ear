const User = require("../models/user");

const registerView = (req, res) => {
  res.render("register", { layout: "main" });
};

const loginView = (req, res) => {
  res.render("login", { layout: "main" });
};

const logoutController = (req, res) => {
  req.session.userId = "";
  res.redirect("/");
};

const loginController = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    req.session.userId = user._id;
    res.redirect("/");
  } catch (e) {
    res.render("login", { errorFlash: true });
  }
};

const registerController = async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect("/login");
  } catch (e) {
    res.render("register", { errorFlash: true });
  }
};

const updateUserController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.session.userId }).lean().exec();
    const validatedUser = await User.findByCredentials(
      user.email,
      req.body.password
    );
    if (validatedUser) {
      validatedUser.password = req.body.newpassword;
      await validatedUser.save();
    }
  } catch (e) {
    console.log(e);
  }

  res.redirect("/login");
};

module.exports = {
  registerView,
  registerController,
  loginView,
  loginController,
  logoutController,
  updateUserController,
};
