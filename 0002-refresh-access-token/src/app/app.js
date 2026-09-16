import express from "express";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

export default app;
