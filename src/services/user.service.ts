import bcrypt from "bcrypt";
import { UserRepo } from "../repositories/user.repository";
import { CreateUserDto, UserDto, userSchema } from "../validations/user.schema";

export class UserService {
  private userRepo = new UserRepo();

  async create(data: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use!");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    console.log("user: ", user);

    const safeUser = userSchema.parse(user.toJSON());
    return safeUser;
  }

  async updatePhoto(id: string, photoUrl: string): Promise<UserDto> {
    const user = await this.userRepo.updatePhoto(id, photoUrl);
    if (!user) {
      throw new Error("User not found");
    }
    const safeUser = userSchema.parse(user.toJSON());
    return safeUser;
  }
}
