import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Matches, Min } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ type: String, required: true, example: 'Oliver' })
  @Matches(/[A-Za-z ]+/, {
    message: 'Only Alphabets and space characters allowed',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, required: true, example: 8 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  age: number;

  @ApiProperty({ type: String, required: true, example: 'Scottish Fold' })
  @Matches(/[A-Za-z ]+/, {
    message: 'Only Alphabets and space characters allowed',
  })
  @IsNotEmpty()
  breed: string;
}
