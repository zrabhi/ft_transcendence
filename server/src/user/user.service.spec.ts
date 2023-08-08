import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { HttpModule } from '@nestjs/axios';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
      // imports: [HttpModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('get users', () => {
    it('should return all the users stored in the database', async () => {
      const users = service.findAllUsers();
      await expect(users).resolves.toBeDefined();
    })
  })

  describe('get users by their ids', () => {
    it('should return the specific user by Id', async () => {
      const user = service.findUserById("cba62691-1586-491f-8fe7-4e2b78ed7173");
      await expect(user).resolves.toBeDefined();
    })
    it('should throw error the user is not stored', async () => {
      const user = service.findUserById("sfsdfsdfsfdsdf");
      expect(user).rejects.toBeInstanceOf(HttpException);
    })
  })

  describe('create a user', () => {
    it('should return id of the created user', async () => {
      let userdto = new CreateUserDto();
      userdto.username = "jiliali10";
      userdto.email = "oyouououo@gmail.com";
      userdto.password = "JilalI10Tt";
      const user = service.addUser(userdto);
      expect(user).resolves.toHaveProperty('id');
    })

    it('should throw exception, the username already used', async () => {
      let userdto = new CreateUserDto();
      userdto.username = "jiliali10";
      userdto.email = "youyou@gmail.com";
      userdto.password = "JilalI10Tt";
      const user = service.addUser(userdto);
      expect(user).rejects.toThrow(HttpException);
    })

    it('should throw exception, the email is not valid', async () => {
      let userdto = new CreateUserDto();
      userdto.username = "leoMessi";
      userdto.email = "youyougmail.com";
      userdto.password = "JilalI10Tt";
      const user = service.addUser(userdto);
      expect(user).rejects.toThrow();
    })
  })

  // describe('update user', async () => {
  //   let updatUserdto = new UpdateUserDto();
  //   updatUserdto.username = "moumni08";
  //   updatUserdto.Oldpassword = "Moha@1234";
  //   updatUserdto.Newpassword = "Komira@1234";
  //   updatUserdto.Confirmedpassword = "Komira@1234";
  //   const user = service.updateUser(updatUserdto);
  //   expect(user).resolves.toHaveProperty('id');
  // })
});
