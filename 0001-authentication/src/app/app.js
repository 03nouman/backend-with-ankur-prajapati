import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from the API!" });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  //  save user to database:

  // token generation:
  const token = jwt.sign(
    {
      email,
      name,
      // _id: user._id,
    },
    "cc828561ce21f21430e5dcaa471194abc46875e7d51bd3651debd605b802b586",
  );
  res.status(201).json({
    message: "User registered successfully",
    token,
    data: { user: { name, email } },
  });
});
export default app;
