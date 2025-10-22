'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './auth'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const session = await auth.getSession()
        if (session.data?.user) {
          setUser(session.data.user as User)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.signIn.email({
        email,
        password,
      })
      
      if (result.data?.user) {
        setUser(result.data.user as User)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await auth.signUp.email({
        email,
        password,
        name,
      })
      
      if (result.data?.user) {
        setUser(result.data.user as User)
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
