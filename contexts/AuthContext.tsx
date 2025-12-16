"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import type { User, UserRole } from "@/lib/supabase/types"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle()

    if (error || !data) {
      console.error("Error fetching role:", error)
      return null
    }

    return data.role as UserRole
  }

  const buildUser = async (
    supabaseUser: SupabaseUser,
  ): Promise<User | null> => {
    const role = await fetchUserRole(supabaseUser.id)
    if (!role) return null

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", supabaseUser.id)
      .maybeSingle()

    return {
      id: supabaseUser.id,
      name:
        typeof profile?.full_name === "string" && profile.full_name.length > 0
          ? profile.full_name
          : supabaseUser.email?.split("@")[0] ?? "User",
      email: supabaseUser.email ?? "",
      role,
    }
  }

  useEffect(() => {
    let mounted = true

    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      setSession(session)

      if (session?.user) {
        const builtUser = await buildUser(session.user)
        setUser(builtUser)
      }

      setIsLoading(false)
    }

    initSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      if (session?.user) {
        const builtUser = await buildUser(session.user)
        setUser(builtUser)
      } else {
        setUser(null)
      }

      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { error: error.message }

    router.push("/dashboard")
    return { error: null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push("/login")
  }

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === "admin",
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
