import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatService {
  constructor(@InjectRepository(Cat) private catRepository: Repository<Cat>) {}

  create(createCatDto: CreateCatDto): Promise<Cat> {
    createCatDto.name = createCatDto.name.trim();
    createCatDto.breed = createCatDto.breed.trim();
    const newCat = this.catRepository.create(createCatDto);
    return this.catRepository.save(newCat);
  }

  findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  findOne(id: number): Promise<Cat> {
    return this.catRepository.findOne(id);
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    if (updateCatDto.name) updateCatDto.name = updateCatDto.name.trim();
    if (updateCatDto.breed) updateCatDto.breed = updateCatDto.breed.trim();
    const oldCat = await this.catRepository.findOne(id);
    oldCat.name = updateCatDto.name ? updateCatDto.name : oldCat.name;
    oldCat.breed = updateCatDto.breed ? updateCatDto.breed : oldCat.breed;
    oldCat.age = updateCatDto.age != undefined ? updateCatDto.age : oldCat.age;
    return this.catRepository.save(oldCat);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.catRepository.delete(id);
  }
}
