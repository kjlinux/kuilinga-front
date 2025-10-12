import { Link } from "react-router-dom"
import { Home } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-secondary mb-4">Page non trouvée</h2>
        <p className="text-accent mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default NotFound
