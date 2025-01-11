import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin"; // Static role
}

const AdminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "admin",
      immutable: true,
    },
  },
  { collection: "jehangira-marbles" }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
