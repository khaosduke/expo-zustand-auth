Expo Zustand Auth

A lightweight authentication starter template for Expo applications using:

* Expo
* React Native
* Supabase Auth
* Zustand
* TypeScript

This project exists because authentication is one of the first hurdles every Expo application encounters, yet most examples are tightly coupled to a specific application.

The goal of this template is to provide a clean, reusable authentication foundation that can be dropped into any Expo project and extended as needed.

⸻

Features

* Supabase Authentication
* Zustand as the single source of truth
* Auth state machine for predictable state transitions
* Session restoration on cold boot
* Claims loading support
* Splash screen driven by auth state
* Minimal boilerplate
* TypeScript support
* Expo Router compatible

⸻

Philosophy

Instead of scattering authentication state across components, contexts, hooks, and effects, this template centralizes auth into a Zustand store.

The application responds to authentication state changes and updates the store accordingly.

UI should react to the store.

This creates a predictable authentication flow and eliminates many common race conditions that occur during startup.

⸻

Authentication State Machine

The auth store transitions through several states:

booting
    ↓
loadingClaims
    ↓
signedOut
    OR
signedInNoClaims
    OR
signedInReady
    OR
error

States

State	Description
booting	Initial application startup
loadingClaims	Session found, claims loading
signedOut	User not authenticated
signedInNoClaims	User authenticated but claims unavailable
signedInReady	User authenticated and ready
error	Authentication failure

⸻

Installation

Clone the repository:

git clone https://github.com/khaosduke/expo-zustand-auth.git

Install dependencies:

npm install

or

pnpm install

or

yarn

⸻

Environment Variables

Create a .env file in the project root.

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

These values can be found in your Supabase dashboard:

Project Settings
    → API

Important

The application will not function without valid Supabase credentials.

Do not commit production credentials or service role keys.

Only the public URL and anonymous key should be used in the Expo client.

⸻

Supabase Setup

Create a project in Supabase.

Enable the authentication providers you wish to support.

For email/password authentication:

Authentication
    → Providers
    → Email

Copy:

* Project URL
* Anon Key

into your .env file.

⸻

Running the App

Start Expo:

npx expo start

Run on Android:

npx expo run:android

Run on iOS:

npx expo run:ios

⸻

Project Structure

src/
├── features/
│   └── auth/
│       ├── AuthStore.ts
│       ├── authController.ts
│       └── ...
│
├── providers/
│   └── AuthProvider.tsx
│
├── lib/
│   └── supabase.ts
│
└── app/
    └── routes...

⸻

Auth Flow

1. App starts
2. AuthProvider initializes
3. Existing Supabase session is restored
4. Zustand store enters loadingClaims
5. Claims are fetched
6. Store transitions to:
    * signedInReady
    * signedInNoClaims
    * signedOut
    * error
7. UI renders based on auth state

⸻

Extending the Template

Common additions include:

* Role based authorization
* User profile management
* Organization support
* Multi-tenant applications
* OAuth providers
* Password reset flows
* Offline persistence
* Feature flags

⸻

Why Zustand?

Zustand provides:

* Minimal boilerplate
* Simple API
* Excellent TypeScript support
* No reducers
* No actions files
* Easy testing
* Easy extraction into reusable libraries

For authentication state, it is often simpler than Redux and more predictable than spreading auth logic throughout React Context providers.

⸻

Intended Use

This repository is intended as a reusable authentication foundation.

Start here, verify authentication works, then build application features on top.

Examples:

* SaaS applications
* Internal tools
* Mobile applications
* EMS software
* Inventory systems
* CRM platforms

⸻

License

MIT