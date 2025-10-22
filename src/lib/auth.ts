import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'user' | 'admin'
}

export interface Session {
  user: User | null
}

// Simple authentication using Supabase
export const auth = {
  getSession: async (): Promise<{ data: Session | null }> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return { data: null }
      }

      // Get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError || !userData) {
        return { data: null }
      }

      return {
        data: {
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: userData.role
          }
        }
      }
    } catch (error) {
      console.error('Error getting session:', error)
      return { data: null }
    }
  },

  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          throw new Error(error.message)
        }

        if (!data.user) {
          throw new Error('Sign in failed')
        }

        // Get user details from our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userError || !userData) {
          throw new Error('User data not found')
        }

        return {
          data: {
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              phone: userData.phone,
              role: userData.role
            }
          }
        }
      } catch (error) {
        console.error('Sign in error:', error)
        throw error
      }
    }
  },

  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      try {
        // First, sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        })

        if (error) {
          throw new Error(error.message)
        }

        if (!data.user) {
          throw new Error('Sign up failed')
        }

        // Create user record in our users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name,
            role: 'user'
          })

        if (insertError) {
          console.error('Error creating user record:', insertError)
          // Don't throw here as the auth user was created successfully
        }

        return {
          data: {
            user: {
              id: data.user.id,
              email: data.user.email!,
              name,
              role: 'user'
            }
          }
        }
      } catch (error) {
        console.error('Sign up error:', error)
        throw error
      }
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      return { data: null }
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }
}

