import { IUser, UserModel } from "../models/user.model";
import { CreateUserDto } from "../validations/user.schema";

export class UserRepo {

  getAll (): Promise<IUser[]> {
    return UserModel.find();
  }

  create(data: CreateUserDto): Promise<IUser> {
    return new UserModel(data).save();
  }

  findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  updatePhoto(id: string, photoUrl: string): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { photoUrl }, { new: true });
  }
}
