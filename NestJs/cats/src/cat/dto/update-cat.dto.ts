import { IsNumber, Matches, IsNotEmpty, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @ApiProperty({ type: String, required: false, example: 'Oliver' })
  @Matches(/[A-Za-z ]+/, {
    message: 'Only Alphabets and space characters allowed',
  })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ type: Number, required: false, example: 8 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  age?: number;

  @ApiProperty({ type: String, required: false, example: 'Scottish Fold' })
  @Matches(/[A-Za-z ]+/, {
    message: 'Only Alphabets and space characters allowed',
  })
  @IsNotEmpty()
  breed?: string;
}
