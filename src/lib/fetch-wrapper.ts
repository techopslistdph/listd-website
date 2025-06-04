export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
  baseURL?: string
}

interface ApiConfig {
  baseURL?: string
  defaultTimeout?: number
  defaultHeaders?: Record<string, string>
}

const DEFAULT_TIMEOUT = 10000
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

const buildURL = (endpoint: string, baseURL = ''): string => {
  if (endpoint.startsWith('http')) {
    return endpoint
  }
  return `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  let data: unknown
  try {
    data = isJson ? await response.json() : await response.text()
  } catch {
    data = null
  }
  if (!response.ok) {
    const errorData = data as { message?: string; error?: string }
    const errorMessage = errorData?.message || errorData?.error || response.statusText || 'Request failed'
    throw new ApiError(errorMessage, response.status, response.statusText, data)
  }

  return data as T
}

const request = async <T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> => {
  const { 
    headers = {}, 
    timeout = DEFAULT_TIMEOUT, 
    signal,
    baseURL = ''
  } = config

  const url = buildURL(endpoint, baseURL)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const requestInit: RequestInit = {
      method,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      signal: signal || controller.signal,
    }

    // Add body for non-GET requests
    if (body !== undefined && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData (browser will set it with boundary)
        delete (requestInit.headers as Record<string, string>)['Content-Type']
        requestInit.body = body
      } else if (typeof body === 'string') {
        requestInit.body = body
      } else {
        requestInit.body = JSON.stringify(body)
      }
    }

    const response = await fetch(url, requestInit)
    clearTimeout(timeoutId)
    
    return handleResponse<T>(response)
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout')
      }
      throw new ApiError(error.message, 0, 'Network Error')
    }
    
    throw new ApiError('Unknown error occurred', 0, 'Unknown Error')
  }
}

const createApi = (config: ApiConfig = {}) => {
  const {
    baseURL = '',
    defaultTimeout = DEFAULT_TIMEOUT,
    defaultHeaders = DEFAULT_HEADERS
  } = config

  const defaultConfig: RequestConfig = {
    baseURL,
    timeout: defaultTimeout,
    headers: defaultHeaders
  }

  return {
    get: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
      request<T>('GET', endpoint, undefined, { ...defaultConfig, ...config }),

    post: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
      request<T>('POST', endpoint, body, { ...defaultConfig, ...config }),

    put: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
      request<T>('PUT', endpoint, body, { ...defaultConfig, ...config }),

    patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> =>
      request<T>('PATCH', endpoint, body, { ...defaultConfig, ...config }),

    delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> =>
      request<T>('DELETE', endpoint, undefined, { ...defaultConfig, ...config }),

    setHeaders: (headers: Record<string, string>) => {
      defaultConfig.headers = { ...defaultConfig.headers, ...headers }
    },

    setAuthToken: (token: string) => {
      defaultConfig.headers = { ...defaultConfig.headers, Authorization: `Bearer ${token}` }
    },

    removeAuthToken: () => {
      const newHeaders = { ...defaultConfig.headers }
      delete newHeaders.Authorization
      defaultConfig.headers = newHeaders
    }
  }
}

export const api = createApi() 