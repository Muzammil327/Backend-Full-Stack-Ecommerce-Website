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

export const FAVOURITE_POST_USER = expressAsyncHandler(async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await users.findOne({ productId });
    if (cart) {
      // If cart item exists, increase its quantity
      cart.quantity += 1;
      // Save the updated cart item
      await cart.save(); // Make sure to await the save operation
      // Send a success response
      res.status(200).json({ message: "Cart item updated successfully" });
    } else {
      const newProduct = new Carts({
        userId,
        productId,
      });
      // Save the new product to the database
      const savedProduct = await newProduct.save();

      // Send the saved product as a response
      res.status(200).json(savedProduct);
    }
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ error: "An error occurred while handling file upload" });
  }
});
