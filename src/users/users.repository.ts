import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  /**
   * Method to convert plain password to hashed password
   *
   * @param password
   */
  async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Method to check is password and hashed password matched
   *
   * @param password
   * @param dbPassword
   */
  async validatePassword(password: string, dbPassword: string) {
    return await bcrypt.compare(password, dbPassword);
  }
}
