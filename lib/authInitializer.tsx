'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'

export const AuthInitializer = () => {
  const supabase = createClient()
  const router = useRouter()
  const { setUser, setIsLoading, user } = useAuthStore()

  useEffect(() => {
    setIsLoading(true)

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          role: session.user.email === "josueaoga0@gmail.com" ? "ADMIN" : "USER"
        })
      } else {
        setUser(null)
        router.push('/login') // 🔁 Redirection si pas connecté
      }
      setIsLoading(false)
    }

    if (!user) {
      init()
    } else {
      setIsLoading(false)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          role: session.user.email === "josueaoga0@gmail.com" ? "ADMIN" : "USER"
        })
      } else {
        setUser(null)
        router.push('/login') // 🔁 Redirection aussi sur déconnexion
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setIsLoading, user, supabase.auth, router])

  return null
}
