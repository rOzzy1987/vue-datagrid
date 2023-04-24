export interface PagingParams {
    items: number;
    page: number;
    orderBy: string | undefined;
    orderAscending: boolean;
}

export interface ShowMoreParams {
    items: number;
    skip: number;
}