import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @MinLength(1)
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsISO8601()
  readonly dueDate: Date;

  @IsOptional()
  @IsBoolean()
  readonly isDone: boolean;

  @IsOptional()
  @IsUUID()
  readonly sectionId: string;
}
