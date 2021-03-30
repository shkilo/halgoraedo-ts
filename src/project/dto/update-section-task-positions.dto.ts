import { IsNumber } from 'class-validator';

export class UpdateSectionTaskPositionsDto {
  @IsNumber({}, { each: true })
  readonly orderedTasks: number[];
}
