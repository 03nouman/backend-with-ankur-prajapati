import express from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Hello from the API!" });
});

// register route:
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("body: ", name, email, password);

    //1.  save user to database:
    const user = await userModel.create({ name, email, password });

    // token generation:
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
      "cc828561ce21f21430e5dcaa471194abc46875e7d51bd3651debd605b802b586",
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      data: { user: { name, email, id: user._id, token } },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// validate token and get user info route:
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  const user = req.user;
  console.log("user:", user);
  res.status(200).json({ user });
});
export default app;
