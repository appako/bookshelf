import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookModel {
    @Expose() @IsOptional() @IsInt() id?: number;
    @Expose() @IsString() @IsNotEmpty() name = '';
    @Expose() @IsString() @IsNotEmpty() author = '';
    @Expose() @IsOptional() @IsString() ownerId?: string;

    // some API records come without id
    key = '';
}
