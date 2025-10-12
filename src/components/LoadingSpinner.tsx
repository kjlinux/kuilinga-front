"use client"

import type React from "react"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-light border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
    </div>
  )
}

export default LoadingSpinner
