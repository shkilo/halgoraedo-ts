import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateBookmarkDto {
  @IsUrl({ require_protocol: true })
  readonly url: string;

  @IsOptional()
  @MinLength(1)
  @IsString()
  readonly title: string;
}
