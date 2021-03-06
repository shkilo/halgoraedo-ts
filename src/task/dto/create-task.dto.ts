import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @MinLength(1)
  @IsString()
  readonly title: string;

  @IsISO8601()
  readonly dueDate: Date;

  @IsUUID(4)
  readonly projectId: string;

  @IsUUID(4)
  readonly sectionId: string;

  @IsOptional()
  @IsUUID(4)
  readonly parentId: string;
}
