// hand-written from real responses: the published spec types every payload as a bare `object`
export type BookDto = { id?: number; name: string; author: string; ownerId?: string };

export type NewBookDto = { name: string; author: string };

export type StatusResponseDto = { status?: string };
