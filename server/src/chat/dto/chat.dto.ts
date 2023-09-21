import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Type } from '@prisma/client';

export class createChannelDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: Type;

  @IsInt()
  memberLimit: number;

  @IsStrongPassword()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  owner_id: string;
}

export class createDmDto {
  @IsString()
  username: string;

  @IsInt()
  memberLimit: number;
}
export class createRoomDto{
  @IsNotEmpty()
  @IsString()
  name: string;


  password?: string;

  @IsNotEmpty()
  @IsString()
  type:Type

  @IsNotEmpty()
  @IsInt()
  memberLimit: number;
}
export class MessageInfo {
  @IsString()
  channelId: string;
  // @IsString()
  // time: string;

  @IsString()
  message: string;
}

// export class getRoomDto{
//   @IsString()
//   name: string;

// }
export class getChannelDmDto
{
  @IsString()
  channelId: string;

  user: any;
}
