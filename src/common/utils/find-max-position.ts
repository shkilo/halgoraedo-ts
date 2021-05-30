import { Section } from '../../project/models/section.model';
import { Task } from '../../task/models/task.model';

export function findMaxPosition(parent: Section | Task): number {
  return parent.tasks.reduce(
    (maxPos, task) => Math.max(maxPos, task.position),
    0,
  );
}
