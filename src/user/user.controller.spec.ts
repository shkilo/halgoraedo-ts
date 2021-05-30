import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';

const mockReq = {
  user: {
    id: 'uuid',
  },
} as any;

describe('ProjectController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = await modRef.resolve(UserController);
  });

  it('Create project', () => {
    expect(controller.me(mockReq)).toEqual({ user: mockReq.user });
  });
});
