import 'dotenv/config'
import express from "express";
import cors from "cors";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "./config/passport.js"; // Import passport configuration
import UserModel from "./config/database.js";
import { db } from "./config/database.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize()); // Initialize passport middleware

// Register Route
app.post("/register", (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });

  user
    .save()
    .then((user) => {
      res.send({
        success: true,
        message: "User created successfully.",
        user: {
          id: user._id,
          username: user.username,
        },
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: "Something went wrong",
        error: err,
      });
    });
});

// Login Route
app.post("/login", (req, res) => {
  UserModel.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Could not find the user.",
      });
    }

    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(payload, "Random string", { expiresIn: "20s" });

    return res.status(200).send({
      success: true,
      message: "Logged in successfully!",
      token: token,
    });
  });
});

// Protected Route
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
      },
    });
  }
);

app.use((err, req, res, next) => {
  console.error("error handler route: \n", err);
  res.status(500).send("Something went wrong!");
});

db()
  .then(() => {
    app.listen(5000, () => console.log("Listening to port 5000"));
  })
  .catch((error) => {
    console.log("db connection failed");
    console.log(error);
  });
