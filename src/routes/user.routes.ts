import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { upload } from "../config/multer";

const router = Router();
const userController = new UserController();

// we used bind because the create is defined as function declaration
// if we define create as named arrow function then we don't need bind
router.get("/", userController.getAll.bind(userController));
router.post("/", userController.create.bind(userController));
router.patch(
  "/:id/photo",
  upload.single("photo"),
  userController.updatePhoto.bind(userController),
);

// router.post("/photos", upload.single("photo"), async (req, res, next) => {
// 	try {
// 		if (!req.file) {
// 			res.status(400).json({ error: "No file uploaded" });
// 		}

// 		const fileUrl = `/uploads/${req.file!.filename}`;
// 		res.status(200).json({ url: fileUrl });
// 	} catch (err) {
// 		next(err);
// 	}
// });

export default router;
