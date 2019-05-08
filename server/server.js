const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const app = express();
const appRouter = require('./routes/appRouter');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cors());

app.use("/api", appRouter);

const API_PORT = 3001;
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));