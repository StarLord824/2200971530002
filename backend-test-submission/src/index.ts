import express from "express";
import bodyParser from "body-parser";
import urlRouter from "./routes/shortUrl";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(logMiddleware);
app.use("/shorturls", urlRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});