import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.route("/file_upload").post(uploadFile);
// .get(protect, updateUserProfile);

export default router;
