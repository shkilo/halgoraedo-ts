import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsBoolean()
  readonly isList?: boolean;

  @IsOptional()
  @IsHexColor()
  readonly color?: string;

  @IsOptional()
  @IsBoolean()
  readonly isFavorite?: boolean;
}
