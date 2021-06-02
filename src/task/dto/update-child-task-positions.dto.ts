import { IsUUID } from 'class-validator';

export class UpdateChildTaskPositionsDto {
  @IsUUID(4, { each: true })
  readonly orderedTasks: string[];
}
