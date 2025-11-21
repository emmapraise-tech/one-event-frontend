export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  version: string;
  timestamp: string;
}
