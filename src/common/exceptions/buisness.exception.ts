import { Exception } from './exception.interface';

export class EntityNotFoundException implements Exception {
  public readonly name = 'EntityNotFoundException';
  public readonly message = 'entity not found';
}
