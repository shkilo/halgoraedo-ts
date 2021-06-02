import { IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @MinLength(1)
  @IsString()
  readonly content: string;
}
