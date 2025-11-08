import { useCallback } from "react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

export const useToast = () => {
  const toast = useCallback((options: ToastOptions) => {
    const { title, description, type = "info", duration = 3000 } = options

    // Create toast element
    const toastElement = document.createElement("div")
    toastElement.className = `toast toast-${type}`
    toastElement.innerHTML = `
      <div class="toast-content">
        <strong>${title}</strong>
        ${description ? `<p>${description}</p>` : ""}
      </div>
    `

    // Add to DOM
    let container = document.getElementById("toast-container")
    if (!container) {
      container = document.createElement("div")
      container.id = "toast-container"
      container.className = "toast-container"
      document.body.appendChild(container)
    }

    container.appendChild(toastElement)

    // Animate in
    setTimeout(() => {
      toastElement.classList.add("toast-show")
    }, 10)

    // Remove after duration
    setTimeout(() => {
      toastElement.classList.remove("toast-show")
      setTimeout(() => {
        toastElement.remove()
        if (container && container.children.length === 0) {
          container.remove()
        }
      }, 300)
    }, duration)
  }, [])

  return { toast }
}
