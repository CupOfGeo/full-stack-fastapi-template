/**
 * Membership Section Component
 *
 * Displays user's membership tier and upgrade option.
 * Shows premium status with badge for premium users,
 * or free tier info with upgrade button for non-premium users.
 */

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react"
import { useState } from "react"

import { type ApiError, StripeService } from "@/client"
import PremiumBadge from "@/components/Premium/PremiumBadge"
import usePremiumStatus from "@/hooks/usePremiumStatus"
import { handleError } from "@/utils"

const MembershipSection = () => {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { isPremium, isLoading, error } = usePremiumStatus()

  /**
   * Initiates Stripe Checkout for premium upgrade.
   * Redirects user to Stripe's hosted payment page.
   */
  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const response = await StripeService.createCheckoutSession()
      window.location.href = response.checkout_url
    } catch (err) {
      handleError(err as ApiError)
      setIsUpgrading(false)
    }
  }

  return (
    <Box mt={8}>
      <Heading size="sm" py={4}>
        Membership
      </Heading>
      <Box w={{ sm: "full", md: "sm" }}>
        {isLoading ? (
          <Text fontSize="md" color="gray.500">
            Loading...
          </Text>
        ) : error ? (
          <Text fontSize="md" color="red.500">
            Unable to load membership status
          </Text>
        ) : isPremium ? (
          <Flex align="center" gap={2}>
            <PremiumBadge isPremium={true} size="md" />
            <Text fontSize="md" fontWeight="medium">
              Premium Member
            </Text>
          </Flex>
        ) : (
          <Box>
            <Text fontSize="md" color="gray.500" mb={3}>
              Free Tier (2 item limit)
            </Text>
            <Button
              variant="solid"
              colorPalette="yellow"
              onClick={handleUpgrade}
              loading={isUpgrading}
            >
              Upgrade to Premium - $1
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MembershipSection
