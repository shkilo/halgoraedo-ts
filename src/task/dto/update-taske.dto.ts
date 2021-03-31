import { IsISO8601, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @MinLength(1)
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsISO8601()
  readonly dueDate: Date;
}
