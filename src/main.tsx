import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
// Initialize API client configuration (must be imported before any API calls)
import "./api/config"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
