import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone1: { type: String },
  phone2: { type: String },
  additionalInfo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
