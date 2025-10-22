import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.getSession()
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'signin':
        const signInResult = await auth.signIn.email(data)
        return NextResponse.json(signInResult)
      
      case 'signup':
        const signUpResult = await auth.signUp.email(data)
        return NextResponse.json(signUpResult)
      
      case 'signout':
        const signOutResult = await auth.signOut()
        return NextResponse.json(signOutResult)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 400 }
    )
  }
}
