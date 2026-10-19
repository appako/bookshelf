import { plainToInstance, type ClassConstructor } from 'class-transformer';

export function plainToModel<T>(cls: ClassConstructor<T>, plain: object): T {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
}
