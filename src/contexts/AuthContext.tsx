"use client"

import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/api"
import authService from "../services/auth.service"
import { useToast } from "../hooks/useToast"
import { AuthContext } from "./definitions/AuthContext"

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  // Listen to localStorage changes for multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" && e.newValue === null) {
        // Token was removed in another tab - sync logout
        setUser(null)
        toast({
          title: "Déconnexion détectée",
          description: "Vous avez été déconnecté dans un autre onglet.",
          type: "info",
          duration: 3000,
        })
        navigate("/login", { replace: true })
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [navigate, toast])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        // Check for token instead of stored user
        const token = localStorage.getItem("access_token")
        if (token) {
          // Validate token by fetching user profile
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        // If getCurrentUser fails (e.g., token expired), the service will handle logout
        console.error("Initialization auth error:", error)
        setUser(null) // Ensure user state is cleared
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password })
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${currentUser.full_name || currentUser.email} !`,
          type: "success",
          duration: 3000,
        })
      } else {
        throw new Error("Could not fetch user profile after login.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
        type: "error",
        duration: 4000,
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
        type: "info",
        duration: 2000,
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear user even if logout call fails
      setUser(null)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
