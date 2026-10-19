import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** Programmer's model of a book; also the runtime validation schema for API records. */
export class BookModel {
    @Expose() @IsOptional() @IsInt() id?: number;
    @Expose() @IsString() @IsNotEmpty() name = '';
    @Expose() @IsString() @IsNotEmpty() author = '';
    @Expose() @IsOptional() @IsString() ownerId?: string;

    /** Stable React key: the API id when present, otherwise the position in the response (some records have no id). */
    key = '';
}
