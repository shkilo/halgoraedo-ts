import { Exception } from './exception.interface';

export class EntityNotFoundException implements Exception {
  public readonly name = 'EntityNotFoundException';
  public readonly message = 'entity not found';
}

export class InvalidOptionException implements Exception {
  public readonly name = 'InvalidOptionException';
  public readonly message = 'option is not valid';
}
