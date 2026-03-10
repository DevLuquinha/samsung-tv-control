export interface ApiResponse {
  status: 'success' | 'error';
  key?: string;
  message?: string;
}
