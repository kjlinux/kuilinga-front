"use client"

import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Identifiants incorrects")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">K</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary mb-2">KUILINGA</h1>
            <p className="text-accent">Système de gestion de présence</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="votre@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="ml-2 text-sm text-accent">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Connexion...</span>
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-accent">© 2025 TANGA GROUP - Tous droits réservés</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
