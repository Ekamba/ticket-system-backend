require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const port = process.env.PORT || 3001;

//API security
app.use(helmet());

//handle CORS error
app.use(cors());

// MongoDB Connection Setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MongoDB is connected");
  });

  mDb.on("error", (error) => {
    console.log(error);
  });

  //   Logger
  app.use(morgan("tiny"));
}

//To parse body
app.use(express.json());

//Load routers
const userRouter = require("./routers/user.router");
const ticketRouter = require("./routers/ticket.router");
// const tokensRouter = require("./routers/tokens.router");

//Use Routers
app.get("/", (req, res) => res.send("API goes here"));
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
// app.use("/v1/tokens", tokensRouter);

// Error handler
const handleError = require("./utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
