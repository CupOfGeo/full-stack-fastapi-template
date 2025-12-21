/**
 * Hook for fetching and caching user's premium status.
 *
 * Uses TanStack Query to fetch from /api/v1/stripe/status endpoint.
 * Caches result and provides loading/error states.
 */

import { useQuery } from "@tanstack/react-query"

import { StripeService } from "@/client"
import { isLoggedIn } from "@/hooks/useAuth"

const usePremiumStatus = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["premiumStatus"],
    queryFn: StripeService.getPremiumStatus,
    enabled: isLoggedIn(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  return {
    isPremium: data?.is_premium ?? false,
    isLoading,
    error,
    refetch,
  }
}

export default usePremiumStatus
