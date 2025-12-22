/**
 * Premium Badge Component
 *
 * Displays a star icon for premium users. Returns null for non-premium users.
 * Used in navbar and settings to indicate premium status.
 */

import { Box } from "@chakra-ui/react"
import { FaStar } from "react-icons/fa"

interface PremiumBadgeProps {
  isPremium: boolean
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "12px",
  md: "16px",
  lg: "20px",
}

const PremiumBadge = ({ isPremium, size = "md" }: PremiumBadgeProps) => {
  if (!isPremium) {
    return null
  }

  return (
    <Box as="span" color="yellow.400" title="Premium Member">
      <FaStar size={sizeMap[size]} />
    </Box>
  )
}

export default PremiumBadge
