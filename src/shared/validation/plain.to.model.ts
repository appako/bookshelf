import { plainToInstance, type ClassConstructor } from 'class-transformer';

/** Maps a raw DTO to a model class, keeping only `@Expose()`-d fields. */
export function plainToModel<T>(cls: ClassConstructor<T>, plain: object): T {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
