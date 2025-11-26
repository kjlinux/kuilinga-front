"use client"

import { Outlet } from "react-router-dom"

const PrivateRoute = () => {
  // Désactivation temporaire de la protection d'authentification
  return <Outlet />
}

export default PrivateRoute
