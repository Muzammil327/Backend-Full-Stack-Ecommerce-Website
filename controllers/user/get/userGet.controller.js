import users from "../../../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

export const GET_ALL_USER = expressAsyncHandler(async (req, res) => {
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
    console.log(error);
    return res.status(400).send(error);
  }
});

export const GET_SINGLE_USER = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getsingleusers = await users.findById(id);

    return res.status(200).send(getsingleusers);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});