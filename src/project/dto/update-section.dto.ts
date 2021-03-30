import { IsString } from 'class-validator';

export class UpdateSectionDto {
  @IsString()
  readonly title: string;
}
