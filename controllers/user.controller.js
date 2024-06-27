import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

export const PUT_USER_Image = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const getsingleusers = await User.findById({ _id: userId });
    if (!getsingleusers) {
      return res.status(400).send("User not found.");
    }

    if (!req.file) {
      return res.status(400).send("Image file is required");
    }

       // Remove the old image if it exists
      //  if (getsingleusers.image) {
      //   const oldImagePath = path.join(__dirname, "../public/user_image/", getsingleusers.image);
      //   if (fs.existsSync(oldImagePath)) {
      //     fs.unlinkSync(oldImagePath);
      //   }
      // }

    const { filename } = req.file;
    const filePath = `${encodeURIComponent(filename)}`;

    // Handle single file upload 'image'
    const savedProduct = await User.findByIdAndUpdate(
      { _id: userId },
      { image: filePath },
      { new: true }
    );
    console.log("savedProduct: ", savedProduct);

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
