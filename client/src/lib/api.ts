// Определяем базовый URL в зависимости от окружения
const getBaseUrl = () => {
  // В production на Replit используем текущий origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    // Добавляем базовый URL, если URL относительный
    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
    
    console.log('API Request:', fullUrl, options.method || 'GET');
    
    const response = await fetch(fullUrl, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = '/auth';
        throw new Error('Необходима авторизация');
      }
      if (response.status === 404) {
        throw new Error('Endpoint не найден. Проверьте URL запроса.');
      }
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error instanceof Error ? error : new Error('Произошла ошибка при запросе к серверу');
  }
};

export const retryApiRequest = async (
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiRequest(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
