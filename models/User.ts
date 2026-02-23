import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  email: string
  password: string
  name: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate model compilation
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
