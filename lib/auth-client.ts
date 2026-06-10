'use client'

import { createAuthClient } from 'better-auth/react'

const baseUrl = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : undefined

export const authClient = createAuthClient({
  baseURL: baseUrl,
})

export const { signIn, signUp, signOut, useSession } = authClient
