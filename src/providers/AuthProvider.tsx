import { AuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect } from 'react'
import { useAuthStore } from '../features/auth/AuthStore'

export default function AuthProvider({ children }: PropsWithChildren) {
  const setClaims = useAuthStore((state) => state.setClaims)

  // Fetch the claims once, and subscribe to auth state changes
  useEffect(() => {
    const state = useAuthStore.getState().state
    console.log('AuthProvider useEffect running, current auth phase:', { state })

    const fetchClaims = async () => {
      useAuthStore.getState().setState("loadingClaims")

      const { data, error } = await supabase.auth.getClaims()

      if (error) {
        console.error('Error fetching claims:', error)
      }

      setClaims(data?.claims ?? null)
      useAuthStore.getState().setState("signedInReady")
    }

    fetchClaims()
    const loadClaims = async () => {
        const { data, error } = await supabase.auth.getClaims()
        if (error) {
            console.error('Error fetching claims:', error)
            setClaims(null)
            useAuthStore.getState().setState("signedOut")
            return
        }
        setClaims(data?.claims ?? null)
        useAuthStore.getState().setState("signedInReady")
    }

    const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, _session) => {
                console.log('Auth state changed:', { event: _event })
                 if (!_session) {
                    setClaims(null);
                    useAuthStore.getState().setState("signedOut")
                    console.log('No active session');
                    return;
                }
                console.log('Active session detected, fetching claims...')
              
                void loadClaims()
               


    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  //Provide a signout function that can be used by the app
    const signOut = async () => {
      await supabase.auth.signOut()
      setClaims(null)
      useAuthStore.getState().setState("signedOut")
    }

  return (
    <AuthContext.Provider value={{ signOut }}>
      {children}
    </AuthContext.Provider>
  )
}