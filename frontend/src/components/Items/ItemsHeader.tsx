/**
 * Items Header Component
 *
 * Displays item count with tier info and Add Item button.
 * Shows upgrade CTA for free users at or near their limit.
 */

import { Button, Flex, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { type ApiError, ItemsService, StripeService } from "@/client"
import PremiumBadge from "@/components/Premium/PremiumBadge"
import usePremiumStatus from "@/hooks/usePremiumStatus"
import { handleError } from "@/utils"

import AddItem from "./AddItem"

const FREE_TIER_LIMIT = 2

const ItemsHeader = () => {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus()

  // Fetch just the count (limit 0 returns only count)
  const { data: itemsData } = useQuery({
    queryKey: ["items", "count"],
    queryFn: () => ItemsService.readItems({ skip: 0, limit: 0 }),
  })

  const itemCount = itemsData?.count ?? 0
  const isAtLimit = !isPremium && itemCount >= FREE_TIER_LIMIT

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
    <Flex justify="space-between" align="center" py={4}>
      <Flex align="center" gap={3}>
        {!isPremiumLoading &&
          (isPremium ? (
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.500">
                {itemCount} items
              </Text>
              <PremiumBadge isPremium={true} size="sm" />
              <Text fontSize="sm" color="yellow.500">
                Premium
              </Text>
            </Flex>
          ) : (
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color={isAtLimit ? "red.500" : "gray.500"}>
                {itemCount}/{FREE_TIER_LIMIT} items (Free Tier)
              </Text>
              {isAtLimit && (
                <Button
                  size="sm"
                  variant="outline"
                  colorPalette="yellow"
                  onClick={handleUpgrade}
                  loading={isUpgrading}
                >
                  Upgrade
                </Button>
              )}
            </Flex>
          ))}
      </Flex>
      <AddItem />
    </Flex>
  )
}

export default ItemsHeader
