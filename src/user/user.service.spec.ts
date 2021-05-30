import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { InvalidOptionException } from '../common/exceptions/buisness.exception';
import { UserService } from './user.service';

const testUser = {
  id: 'uuid',
  name: 'test',
  email: 'test@test',
  provider: 'test',
};
const userDto = {
  id: 'uuid',
  email: 'test@test',
} as any;

describe('ProjectService', () => {
  let service: UserService;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn(() => testUser),
            findOne: jest.fn(() => testUser),
            findByPk: jest.fn(() => testUser),
          },
        },
      ],
    }).compile();
    service = modRef.get(UserService);
  });

  it('Find a user by id or email', async () => {
    expect(await service.findOne(userDto.id, { by: 'id' })).toEqual(testUser);
    expect(await service.findOne(userDto.email, { by: 'email' })).toEqual(
      testUser,
    );
  });
  it('Find or create user', async () => {
    expect(await service.findOrCreate(userDto)).toEqual(testUser);
  });
});
