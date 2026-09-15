import app from "./app/app.js";
import connectDB from "./config/db.js";

await connectDB();

console.log("Database connected successfully");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
