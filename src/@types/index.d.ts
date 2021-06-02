import { User as UserModel } from '../user/user.model';

declare global {
  namespace Express {
    export interface User extends UserModel {}
  }
}
