import React, { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { appStyles } from '../styles/styles'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null)
  const styles = appStyles

  async function signInWithEmail() {
    setRegistrationMessage(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setRegistrationMessage(null)
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    } else if (data?.user) {
      setRegistrationMessage('Registration successful. Check your email to confirm your account before signing in.')
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => signUpWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      {registrationMessage ? (
        <View style={styles.verticallySpaced}>
          <Text style={styles.successMessage}>{registrationMessage}</Text>
        </View>
      ) : null}
    </View>
  )
}