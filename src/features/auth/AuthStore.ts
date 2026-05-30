type AuthState = 
    | "booting"
    | "loadingClaims"
    | "signedOut"
    | "signedInNoClaims"
    | "signedInReady"
    | "error";

interface AuthStore {
  state: AuthState;
  user: AppUser | null;
  claims: Claims | null;

  setState: (state: AuthState) => void;
  setUser: (user: AppUser | null) => void;
  setClaims: (claims: Claims | null) => void;
}    
