import { User as UserModel } from 'src/user/user.model';

declare global {
  namespace Express {
    export interface User extends UserModel {}
  }
}
