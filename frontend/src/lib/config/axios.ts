'use client'

import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true, // sends customer_session cookie cross-origin
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — redirect to /login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const pathname = window.location.pathname
      if (pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
