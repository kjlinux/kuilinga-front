import { Howl } from "howler"

const useNotification = () => {
  const playNotificationSound = () => {
    const sound = new Howl({
      src: ["/notification.mp3"],
    })
    sound.play()
  }

  return { playNotificationSound }
}

export default useNotification
