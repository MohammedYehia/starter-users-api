import { UserTokenPayload } from "../auth";

// we do declaration merging to avoid extending the request and calling the new type on each file
// ex: our app wants to add "user" to every request in Express
declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayload;
    }
  }
}

export {};
