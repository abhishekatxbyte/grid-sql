import express from "express";
import { updateData } from "../controllers/fileController.js";

const router = express.Router();

router.route("/").patch(updateData);

export default router;
