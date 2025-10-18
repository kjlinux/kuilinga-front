import { useContext } from "react"
import { Howl } from "howler"
import { NotificationContext } from "../contexts/definitions/NotificationContext"

const useNotification = () => {
  const playNotificationSound = () => {
    const sound = new Howl({
      src: ["/notification.mp3"],
    })
    sound.play()
  }

  return { playNotificationSound }
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  
  return context
}

export default useNotification