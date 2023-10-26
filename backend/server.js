// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import cookieParser from "cookie-parser";

// import root from "./routes/root.js";
// import userRoutes from "./routes/userRoutes.js";
// import fileUploadRoutes from "./routes/fileUploadRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// import connectDB from "./config/db.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.resolve(__dirname, "./.env") });
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// app.use("/", express.static(path.join(__dirname, "public")));

// app.use("/", root);
// app.use("/api/users", userRoutes);
// app.use("/api/file_upload", fileUploadRoutes);

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });

// app.use(notFound);
// app.use(errorHandler);

// app.listen(PORT, () => console.log(`listening on port ${PORT}`));
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"; // Import express-fileupload module

import root from "./routes/root.js";
import userRoutes from "./routes/userRoutes.js";
import fileUploadRoutes from "./routes/fileUploadRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Make __dirname global
global.__dirname = __dirname;

dotenv.config({ path: path.resolve(__dirname, "./.env") });
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(fileUpload()); // Use the express-fileupload middleware

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", root);
app.use("/api/users", userRoutes);
app.use("/api/file_upload", fileUploadRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
