import { AuthContext } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect } from 'react'
import { useAuthStore } from '../features/auth/AuthStore'

/**
 * AuthProvider
 *
 * Responsibilities:
 * ----------------
 * AuthProvider is the sole authority responsible for synchronizing the
 * application's authentication state with Supabase and updating the Zustand
 * auth store accordingly.
 *
 * Architecture:
 * -------------
 * Supabase Auth
 *      ↓
 * AuthProvider
 *      ↓
 * Zustand AuthStore
 *      ↓
 * Route Guards / UI
 *
 * AuthProvider is the only component permitted to mutate auth-related state
 * within the Zustand store. All other components should treat the store as
 * read-only and consume state via selectors.
 *
 * AuthContext:
 * ------------
 * AuthContext exists only to expose authentication actions (currently signOut)
 * to the application. It does not store or manage authentication state.
 *
 * Auth State Machine:
 * -------------------
 * booting
 *   Initial application startup. Session status has not yet been determined.
 *
 * signedOut
 *   No valid session exists.
 *
 * signedInNoClaims
 *   A valid authenticated session exists, but claims have not yet been loaded.
 *
 * loadingClaims
 *   Claims are currently being fetched from Supabase.
 *
 * signedInReady
 *   Session and claims have both been successfully loaded and the application
 *   may render authenticated routes.
 *
 * error
 *   An unrecoverable authentication or claims-loading error occurred.
 *
 * Startup Flow:
 * -------------
 * 1. Application starts.
 * 2. AuthProvider enters "booting".
 * 3. getSession() checks locally persisted session state.
 * 4. If no session exists:
 *      -> reset store
 *      -> signedOut
 * 5. If a session exists:
 *      -> store user
 *      -> clear claims
 *      -> signedInNoClaims
 *      -> loadClaims()
 * 6. Claims successfully load:
 *      -> signedInReady
 *
 * Auth Change Flow:
 * -----------------
 * Supabase auth state changes are observed through onAuthStateChange().
 *
 * Sign In:
 *      session detected
 *      -> store user
 *      -> clear claims
 *      -> signedInNoClaims
 *      -> loadClaims()
 *      -> signedInReady
 *
 * Sign Out:
 *      session removed
 *      -> reset store
 *      -> signedOut
 *
 * Important Rules:
 * ----------------
 * - Supabase is the source of truth for authentication.
 * - Zustand is the source of truth for UI auth state.
 * - AuthProvider is the synchronization layer between them.
 * - No component outside AuthProvider should directly modify auth state.
 * - Route guards should only allow protected routes when state is
 *   "signedInReady".
 */



//Only AuthProvider should be setting zustands state, and it should be based on the supabase auth state and claims. The AuthContext is only for providing the signOut function to the app, which will trigger the auth state change and cause the zustand state to update accordingly. This way we have a single source of truth for the auth state (the zustand store) that is kept in sync with supabase auth state changes.
export default function AuthProvider({ children }: PropsWithChildren) {
  // Fetch the claims once, and subscribe to auth state changes
  useEffect(() => {
    const state = useAuthStore.getState().state
    console.log('AuthProvider useEffect running, current auth phase:', { state })

    const loadClaims = async () => {
        const store = useAuthStore.getState();
        store.setState("loadingClaims")
        const { data, error } = await supabase.auth.getClaims()
        if (error) {
            console.error('Error fetching claims:', error)
            store.setClaims(null)
            store.setState("error")
            return
        }
        store.setClaims(data?.claims ?? null)
        store.setState("signedInReady")
    }
   
      const bootstrap = async () => {
        const store = useAuthStore.getState();

        store.setState("booting");

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          store.reset();
          return;
        }

        store.setState("signedInNoClaims");
        store.setUser(data.session.user)
        store.setClaims(null)
        await loadClaims();
      }

    const { 
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, _session) => {
                const store = useAuthStore.getState();
                console.log('Auth state changed:', { event: _event })
                 if (!_session) {
                    store.reset()
                    console.log('No active session');
                    return;
                }
                console.log('Active session detected, fetching claims...')
                store.setUser(_session.user)
                store.setClaims(null)
                void loadClaims()

    })
    void bootstrap()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  //Provide a signout function that can be used by the app
    const signOut = async () => {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Error signing out:", error)
        useAuthStore.getState().setState("error")
        return
      }

      useAuthStore.getState().reset()
    }

  return (
    <AuthContext.Provider value={{ signOut }}>
      {children}
    </AuthContext.Provider>
  )
}