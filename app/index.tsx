import { View } from "react-native";
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../components/Account'

export default function HomeScreen() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      const claims = data?.claims
      if (!claims) return

      setUserId(claims.sub)
      setEmail(claims.email)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getClaims()
      const claims = data?.claims

      if (!claims) {
        setUserId(null)
        setEmail(undefined)
        return
      }

      setUserId(claims.sub)
      setEmail(claims.email)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <View>{userId ? <Account key={userId} userId={userId} email={email} /> : <Auth />}</View>
}

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>✅ Expo is running</Text>
//       <Text>Edit app/index.tsx to get started</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
