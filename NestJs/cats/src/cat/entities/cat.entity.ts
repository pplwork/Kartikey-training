import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cat {
  @ApiProperty({ type: Number, example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'Oliver' })
  @Column()
  name: string;

  @ApiProperty({ type: String, example: 8 })
  @Column()
  age: number;

  @ApiProperty({ type: String, example: 'Scottish Fold' })
  @Column()
  breed: string;
}
