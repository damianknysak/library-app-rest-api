const express = require("express");
const app = express();
const cors = require("cors");

//allow all cors
app.use(cors({ credentials: true, origin: true }));
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./api/routes/books");
const userRoutes = require("./api/routes/users");
const likedBookRoutes = require("./api/routes/likedbooks");
const libraryBookRoutes = require("./api/routes/librarybooks");
//db connection

mongoose.connect(
  "mongodb+srv://damian:" +
    process.env.MONGO_ATLAS_PW +
    "@library-cluster0.n1dm2de.mongodb.net/?retryWrites=true&w=majority"
);

//middleware
app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//public images
app.use("/images", express.static("images"));

//Routes that handle requests
app.use("/books", bookRoutes);

app.use("/users", userRoutes);

app.use("/likedbooks", likedBookRoutes);

app.use("/librarybooks", libraryBookRoutes);

//Invalid routes
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Server error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
