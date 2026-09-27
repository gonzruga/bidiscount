
import axios from 'axios';

export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function createProduct(
  formData: FormData,
) {
  const response = await fetch(
    `${API_URL}/products`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Failed to create product',
    );
  }

  return data;
}