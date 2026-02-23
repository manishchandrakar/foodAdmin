import { Router } from "express";
import { requireAdminOrSubadmin } from "../middlewares/authMiddleware";
import { upload, handleUpload } from "../controllers/uploadController";

const router = Router();

router.post("/", requireAdminOrSubadmin, upload.single("file"), handleUpload);

export default router;
