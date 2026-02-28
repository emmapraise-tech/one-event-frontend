export interface ApiResponse<T> {
	status: boolean;
	message: string;
	data: T;
	version: string;
	timestamp: string;
}

export interface PaginatedMetaData {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface PaginatedData<T> {
	data: T[];
	meta: PaginatedMetaData;
}
