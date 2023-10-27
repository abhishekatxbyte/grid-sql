import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { getData, uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.route("/").post(uploadFile);
router.get("/:query", getData);
// .get(protect, updateUserProfile);

export default router;
