import { IsUUID } from 'class-validator';

export class UpdateSectionTaskPositionsDto {
  @IsUUID(4, { each: true })
  readonly orderedTasks: string[];
}
