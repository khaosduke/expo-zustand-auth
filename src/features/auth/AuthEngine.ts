// src/features/auth/authController.ts
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './AuthStore'

async function loadClaims() {
  const store = useAuthStore.getState()

  store.setState("loadingClaims")

  const { data, error } = await supabase.auth.getClaims()

  if (error) {
    console.error("Error fetching claims:", error)
    store.setClaims(null)
    store.setState("error")
    return
  }

  store.setClaims(data?.claims ?? null)
  store.setState("signedInReady")
  console.log('AUTH STATE CHANGE:', useAuthStore.getState().state)
}

export async function bootstrapAuth() {
  const store = useAuthStore.getState()

  store.setState("booting")

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    store.reset()
    return
  }

  store.setUser(data.session.user)
  store.setClaims(null)
  store.setState("signedInNoClaims")

  await loadClaims()
}

export function subscribeToAuthChanges() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const store = useAuthStore.getState()

    if (!session?.user) {
      store.reset()
      console.log('No active session');
      console.log('AUTH STATE CHANGE:', useAuthStore.getState().state)
      return
    }

    store.setUser(session.user)
    store.setClaims(null)
    store.setState("signedInNoClaims")

    void loadClaims()
  })

  return () => subscription.unsubscribe()
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    useAuthStore.getState().setState("error")
    return
  }

  useAuthStore.getState().reset()
}