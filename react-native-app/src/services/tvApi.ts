import { API_BASE_URL } from '@env';
import type { ApiResponse } from '../types';

export async function sendKey(key: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/send/${encodeURIComponent(key)}`);
  const data: ApiResponse = await response.json();

  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message ?? 'Unknown error');
  }

  return data;
}
