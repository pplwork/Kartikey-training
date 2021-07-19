import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CatService } from './cat.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

@ApiTags('Cat CRUD Operations')
@Controller()
export class CatController {
  constructor(private readonly catService: CatService) {}

  @ApiCreatedResponse({ type: Cat })
  @ApiBadRequestResponse()
  @Post()
  create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catService.create(createCatDto);
  }
  @ApiOkResponse({ type: Cat, isArray: true })
  @Get()
  findAll(): Promise<Cat[]> {
    return this.catService.findAll();
  }
  @ApiOkResponse({ type: Cat })
  @ApiNotFoundResponse({ description: 'Cat Not Found' })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Cat | HttpException> {
    const cat = await this.catService.findOne(id);
    if (cat) return this.catService.findOne(id);
    throw new HttpException('Cat Not Found', HttpStatus.NOT_FOUND);
  }

  @ApiOkResponse({ type: Cat })
  @ApiNotFoundResponse({ description: 'Cat Not Found' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat | HttpException> {
    const cat = await this.catService.findOne(id);
    if (cat) {
      return this.catService.update(id, updateCatDto);
    }
    throw new HttpException('Cat Not Found', HttpStatus.NOT_FOUND);
  }

  @ApiOkResponse({ description: 'Cat Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Cat Not Found' })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string } | HttpException> {
    const cat = await this.catService.findOne(id);
    if (cat) {
      await this.catService.remove(id);
      return { message: 'Cat Succesfully Deleted.' };
    }
    throw new HttpException('Cat Not Found', HttpStatus.NOT_FOUND);
  }
}
