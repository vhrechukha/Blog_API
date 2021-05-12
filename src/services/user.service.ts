import { injectable } from 'inversify';
import bcrypt from 'bcrypt';
import {
    getConnection,
    Repository,
} from 'typeorm';

import { Users } from '../entities/users';
import { DBUserDataDTO } from '../models/user.model';

export interface IUser {
  email: string;
  name: string;
}

@injectable()
export class UserService {
  private repository: Repository<Users>;

  constructor() {
      this.repository = getConnection().getRepository<Users>('users');
  }

  async getAllUsers(page: number): Promise<Users[]> {
      return this.repository.find({
          skip: page !== undefined ? page * 5 : 0,
          take: 5,
      });
  }

  async getUserById(id: number): Promise<Users> {
      return this.repository.findOneOrFail(id);
  }

  async getUserByEmail(email: string): Promise<Users> {
      return this.repository.findOneOrFail({ email });
  }

  async updateUser(userData: DBUserDataDTO): Promise<Users> {
      const hashedPassword = await bcrypt.hash(userData.password, 5);

      return this.repository.save({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
      });
  }
}
