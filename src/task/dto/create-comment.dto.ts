import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateCommentDto {
  @MinLength(1)
  @IsString()
  readonly content: string;

  @IsUUID(4)
  readonly taskId: string;
}
