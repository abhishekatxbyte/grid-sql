import express from "express";
import { getData, uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.route("/").post(uploadFile);
router.get("/", getData);
// .get(protect, updateUserProfile);

export default router;
