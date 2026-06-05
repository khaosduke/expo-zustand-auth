import { AuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect } from 'react'
import { useAuthStore } from '../features/auth/AuthStore'

export default function AuthProvider({ children }: PropsWithChildren) {
  //const [claims, setClaims] = useState<Record<string, any> | undefined | null>()
  //const [hasSession, setHasSession] = useState<boolean>(false)
  //const [isLoading, setIsLoading] = useState<boolean>(true)
  const [claims, setClaims] = useAuthStore((state) => [state.claims, state.setClaims])
  // Fetch the claims once, and subscribe to auth state changes
  useEffect(() => {
    const state = useAuthStore.getState().state
    console.log('AuthProvider useEffect running, current auth phase:', { state })

    const fetchClaims = async () => {
      //setIsLoading(true)
      useAuthStore.getState().setState("loadingClaims")

      const { data, error } = await supabase.auth.getClaims()

      if (error) {
        console.error('Error fetching claims:', error)
      }

      setClaims(data?.claims ?? null)
      //setIsLoading(false)
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
                //const { data } = await supabase.auth.getClaims()
                //setClaims(data?.claims ?? null)
                //console.log('Updated claims:', { claims: data?.claims })
                 if (!_session) {
                    setClaims(null);
                    useAuthStore.getState().setState("signedOut")
                    console.log('No active session');
                    return;
                }
                console.log('Active session detected, fetching claims...')
                /*try {
                    const { data, error } = await supabase.auth.getClaims();
                    console.log('Claims fetch result:', { data, error });
                    if (error) {
                    console.error("Error fetching claims:", error);
                    setClaims(null);
                    return;
                    }

                    setClaims(data?.claims ?? null);
                    setHasSession(true);
                    console.log("Claims updated:", { claims: data?.claims });
                } finally {
                    setIsLoading(false);
                }*/
                void loadClaims()
               


    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])


  return (
    <AuthContext.Provider
      value={{
        claims,
        hasSession,
        isLoading,
        isLoggedIn: claims != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}