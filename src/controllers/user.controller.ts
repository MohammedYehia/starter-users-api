import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { createUserSchema } from "../validations/user.schema";
import { userIdParamSchema } from "../validations/common.schema";

export class UserController {
  private userService = new UserService();

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await this.userService.create(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updatePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdParamSchema.parse(req.params);

      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
      }

      const domain = process.env.DOMAIN;
      const photoUrl = `${domain}/uploads/${req.file!.filename}`;
      const user = await this.userService.updatePhoto(id, photoUrl);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
