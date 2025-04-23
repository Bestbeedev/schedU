'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { createClient } from '@/lib/client'

export const AuthInitializer = () => {
  const supabase = createClient()
  const { setUser, setIsLoading, user } = useAuthStore()

  useEffect(() => {
    setIsLoading(true)

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log("SESSION DATA Initializer:", session)
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          role: session.user.email === "josueaoga0@gmail.com" ? "ADMIN" : "USER"
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    // Vérification de session persistée dans localStorage si elle n'est pas déjà présente dans le store
    if (!user) {
      init()
    } else {
      setIsLoading(false)
    }

    // Listener sur changements de session
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
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setIsLoading, user])

  return null
}
