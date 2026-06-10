'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

interface OAuthButtonsProps {
  mode?: 'sign-in' | 'sign-up'
}

export function OAuthButtons({ mode = 'sign-in' }: OAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple' | 'microsoft') => {
    try {
      setLoading(provider)
      setError(null)
      
      // Better Auth automatically handles OAuth redirect
      await authClient.signIn.social({
        provider,
        callbackURL: '/',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth sign-in failed'
      setError(message)
      console.log('[v0] OAuth error:', message)
    } finally {
      setLoading(null)
    }
  }

  const providers = [
    { id: 'google', label: 'Google', icon: '🔍' },
    { id: 'github', label: 'GitHub', icon: '🐙' },
    { id: 'apple', label: 'Apple', icon: '🍎' },
    { id: 'microsoft', label: 'Microsoft', icon: '⊞' },
  ] as const

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant="outline"
            onClick={() => handleOAuthSignIn(id)}
            disabled={loading !== null}
            className="w-full"
          >
            <span className="mr-2">{icon}</span>
            {loading === id ? 'Signing in...' : label}
          </Button>
        ))}
      </div>
    </div>
  )
}
