import { BadRequestException } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { CreateProjectDto } from '../../project/dto/create-project.dto';

const failString = 'should throw an error for incorrect type';

describe('CatPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });
  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('create project DTO validation', () => {
    const dto = {
      title: 'test1',
      color: '#000000',
      isFavorite: true,
      isList: true,
    };
    const mockMetadata = { metatype: CreateProjectDto } as any;

    describe('successful calls', () => {
      it('should let the DTO go on through', async () => {
        expect(await pipe.transform(dto, mockMetadata)).toEqual(dto);
      });
    });
    describe('unsuccessful calls', () => {
      describe('age errors', () => {
        it('should throw an error for missing age', async () => {
          dto.title = undefined as any;
          const errorPipe = () => pipe.transform(dto, mockMetadata);
          await expect(errorPipe).rejects.toBeInstanceOf(BadRequestException);
        });
        it(failString, async () => {
          dto.title = 1 as any;
          const errorPipe = () => pipe.transform(dto, mockMetadata);
          await expect(errorPipe).rejects.toBeInstanceOf(BadRequestException);
        });
      });
      describe('name errors', () => {
        it(failString, async () => {
          dto.color = '#??????' as any;
          const errorPipe = () => pipe.transform(dto, mockMetadata);
          await expect(errorPipe).rejects.toBeInstanceOf(BadRequestException);
        });
      });
      describe('breed errors', () => {
        it(failString, async () => {
          dto.isList = '?' as any;
          const errorPipe = () => pipe.transform(dto, mockMetadata);
          await expect(errorPipe).rejects.toBeInstanceOf(BadRequestException);
        });
      });
      describe('breed errors', () => {
        it(failString, async () => {
          dto.isFavorite = '?' as any;
          const errorPipe = () => pipe.transform(dto, mockMetadata);
          await expect(errorPipe).rejects.toBeInstanceOf(BadRequestException);
        });
      });
    });
  });
});
