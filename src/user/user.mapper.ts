import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

export type SafeUser = Omit<User, 'password'> | Omit<User, 'password'>[];

@Injectable()
export class UserMapper {
  private defaultOmit: Array<keyof User> = ['password'];

  public omit(user: User | User[]): SafeUser {
    if (Array.isArray(user)) {
      return user.map((user) => omit(user, this.defaultOmit)) as SafeUser;
    }
    return omit(user, this.defaultOmit) as SafeUser;
  }

  public omitCustomFields<T extends keyof User>(
    user: User,
    fields: T[],
  ): Omit<User, T> {
    return omit(user, fields) as Omit<User, T>;
  }
}
