/**
 * Payload shapes observed on the live API. The published spec types every payload as a bare `object`,
 * so these are hand-written and incoming data is validated at runtime (see BookModel).
 */
export type BookDto = { id?: number; name: string; author: string; ownerId?: string };

export type NewBookDto = { name: string; author: string };

export type AddBookResponseDto = { status?: string };
