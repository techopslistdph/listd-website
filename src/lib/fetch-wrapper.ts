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
}

class FetchWrapper {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number

  constructor(baseURL = '', defaultTimeout = 10000) {
    this.baseURL = baseURL
    this.defaultTimeout = defaultTimeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers }
  }

  setAuthToken(token: string) {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` })
  }

  removeAuthToken() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...rest } = this.defaultHeaders
    this.defaultHeaders = rest
  }

  private buildURL(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  private async handleResponse<T>(response: Response): Promise<T> {
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

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildURL(endpoint)
    const { headers = {}, timeout = this.defaultTimeout, signal } = config

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const requestInit: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
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
      
      return this.handleResponse<T>(response)
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

  // GET request
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, body, config)
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, body, config)
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, config)
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }
}

export const fetchWrapper = new FetchWrapper()

export { FetchWrapper }

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => fetchWrapper.get<T>(endpoint, config),
  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) => fetchWrapper.post<T>(endpoint, body, config),
  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) => fetchWrapper.put<T>(endpoint, body, config),
  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) => fetchWrapper.patch<T>(endpoint, body, config),
  delete: <T>(endpoint: string, config?: RequestConfig) => fetchWrapper.delete<T>(endpoint, config),
  setAuthToken: (token: string) => fetchWrapper.setAuthToken(token),
  removeAuthToken: () => fetchWrapper.removeAuthToken(),
} 