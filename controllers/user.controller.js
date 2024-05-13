import users from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

export const GET_USER_ADMIN_STATS = expressAsyncHandler(async (req, res) => {
  try {
    const getusers = await users.aggregate([
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return res.status(200).send(getusers);
  } catch (error) {
    console.error("Error Get User Admin Stats", error);
    return res.status(400).send(error);
  }
});

export const GET_SINGLE_USER = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getsingleusers = await users.findById({ _id: id });

    return res.status(200).send(getsingleusers);
  } catch (error) {
    console.error("Error Getting Single User", error);
    return res.status(400).send(error);
  }
});

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
