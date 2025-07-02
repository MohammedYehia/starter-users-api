import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    photoUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_, res) => {
    res.id = res._id.toString();
    delete res.password;
    delete res._id;
    return res;
  },
});

export const UserModel = model<IUser>("User", userSchema);
