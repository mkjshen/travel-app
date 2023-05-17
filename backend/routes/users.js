const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    console.log({ foundUser });

    if (foundUser) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );
      if (validPassword) {
        res.status(200).json({ username: foundUser.username });
      } else {
        res.status(400).json({ err: "Incorrect username or password" });
      }
    } else {
      res.status(400).json({ err: "Incorrect username or password" });
    }
  } catch (error) {
    res.status(500).json({ error, test: "test" });
  }
});

module.exports = router;
