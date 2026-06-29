import { View } from "react-native";
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'

export default function HomeScreen() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | undefined>(undefined)

  const clearUser = () => {
    setUserId(null)
    setEmail(undefined)
  }

  const syncUserFromSession = (session: { user?: { id?: string; email?: string | null } } | null) => {
    const user = session?.user
    if (!user?.id) {
      clearUser()
      return
    }

    setUserId(user.id)
    setEmail(user.email ?? undefined)
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => syncUserFromSession(data.session))
      .catch(() => clearUser())

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUserFromSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <View>{userId ? <Account key={userId} userId={userId} email={email} /> : <Auth />}</View>
}
