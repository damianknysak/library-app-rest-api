const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bookRoutes = require("./api/routes/books");
const userRoutes = require("./api/routes/users");

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

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  //browser options request
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "PUT",
      "PATCH",
      "POST",
      "GET",
      "DELETE"
    );
    return res.status(200).json({});
  }
  next();
});

//Routes that handle requests
app.use("/books", bookRoutes);

app.use("/users", userRoutes);

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
