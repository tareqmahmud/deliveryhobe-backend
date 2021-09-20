import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

describe('Authentication Service', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  let fakeMailerService: {
    sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo>;
  };

  beforeEach(async () => {
    // Fake users
    const users = [];

    // Create fake mailer service
    fakeMailerService = {
      sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
        const message = 'Mail sent successfully';

        return Promise.resolve(message);
      },
    };

    // Create fake service
    fakeUserService = {
      async findUserByUsername(username: string): Promise<null | User> {
        const user = users.find((user) => user.username === username);

        return Promise.resolve(user);
      },
      async findUserByEmail(email: string): Promise<null | User> {
        const user = users.find((user) => user.email === email);

        return Promise.resolve(user);
      },
      async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = {
          id: Math.floor(Math.random() * 99999),
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password,
        } as User;

        return Promise.resolve(newUser);
      },
    };

    // Create fake module service
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'sdfjsdlfkjdslfj',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: MailerService,
          useValue: fakeMailerService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  // Boilerplate Done.

  // Now start actual testing
  it('should create a instance of auth service', function () {
    expect(service).toBeDefined();
  });

  it('should create new user', async function () {
    const user = await service.create({
      username: 'test',
      password: 'test',
      email: 'test@test.com',
    });

    expect(user.email).toEqual('test@test.com');
    expect(user.username).toEqual('test');
    // Because password will encrypted
    expect(user.password).not.toEqual('test');
  });
});
