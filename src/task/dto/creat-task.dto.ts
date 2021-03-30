import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @MinLength(1)
  @IsString()
  readonly title: string;

  @IsISO8601()
  readonly dueDate: Date;

  @IsNumber()
  readonly projectId: number;

  @IsNumber()
  readonly sectionId: number;

  @IsOptional()
  @IsNumber()
  readonly parentId: number;
}
