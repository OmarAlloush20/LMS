import express from "express";
import multer from "multer";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../Helpers/cloudinary.js";

// media routes
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error Uplodaing File" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Assest Id is required" });
    }

    await deleteMediaFromCloudinary(id);
    res.status(200).json({
      success: true,
      message: "Assest Deleted Successfully from Cloudinary",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error Deleting File" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );
    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in bulk uploading" });
  }
});

export default router;
