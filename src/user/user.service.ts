import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/user/entities/user.entity';
import * as UserEntitiy from '@/user/entities/user.entity';
import { DATABASE_CONNECTION } from '@/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof UserEntitiy>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.db.query.users.findFirst({
      where: eq(UserEntitiy.users.email, createUserDto.email),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(
      createUserDto.password,
      bcrypt.genSaltSync(10),
    );
    // create new user (ommit confirmPassword which is only needed for validation)
    const { confirmPassword, ...payload } = createUserDto;

    const [user] = await this.db
      .insert(UserEntitiy.users)
      .values({
        ...payload,
        password: hashPassword,
      })
      .returning();

    return user;
  }

  findAll() {
    const users: User[] = [
      {
        id: 1,
        username: 'fenton',
        fullName: 'Fenton Phillips',
        email: 'fenton@gmail.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: 'jimmy',
        fullName: 'jmmy fixit',
        email: 'Jimmy@gmail.com',
        password: 'password2222',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return users;
  }

  findOne(id: number) {
    // return `This action returns a #${id} user`;
    return {
      id: id,
      username: 'fenton',
      email: 'fenton@gmail.com',
      password: 'password',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
