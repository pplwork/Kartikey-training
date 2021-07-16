import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNumber } from 'class-validator';

export class User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
