import users from "../../../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

export const PUT_USER = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { phone, address, country, city, zipCode, username } = req.body;
  try {
    const savedProduct = await users.findByIdAndUpdate(
      id,
      { phone, address, country, city, zipCode, username },
      { new: true }
    );
    res.status(200).json(savedProduct);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});