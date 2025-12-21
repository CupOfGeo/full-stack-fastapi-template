/**
 * Payment Success Page
 *
 * Displayed after successful Stripe payment. Shows confirmation message,
 * refreshes premium status, and auto-redirects to dashboard.
 */

import { Container, Heading, Text, VStack } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { FaStar } from "react-icons/fa"

import { Button } from "@/components/ui/button"

const REDIRECT_DELAY_SECONDS = 5

export const Route = createFileRoute("/payment-success")({
  component: PaymentSuccess,
})

function PaymentSuccess() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS)

  // Get session_id from URL if present (for debugging)
  const urlParams = new URLSearchParams(window.location.search)
  const sessionId = urlParams.get("session_id")

  // Log session ID for debugging if present
  useEffect(() => {
    if (sessionId) {
      console.debug("Payment success - session_id:", sessionId)
    }
  }, [sessionId])

  // Invalidate premium status cache to fetch fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["premiumStatus"] })
  }, [queryClient])

  // Countdown and auto-redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate({ to: "/" })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleGoToDashboard = () => {
    navigate({ to: "/" })
  }

  return (
    <Container
      h="100vh"
      maxW="md"
      alignItems="center"
      justifyContent="center"
      centerContent
    >
      <VStack gap={6} textAlign="center">
        <FaStar size={64} color="#ECC94B" />

        <Heading size="xl">Payment Successful!</Heading>

        <Heading size="lg" color="yellow.500">
          Welcome to Premium
        </Heading>

        <Text fontSize="md" color="gray.500">
          You now have unlimited items and a premium badge.
        </Text>

        <Button variant="solid" onClick={handleGoToDashboard} size="lg">
          Go to Dashboard
        </Button>

        <Text fontSize="sm" color="gray.400">
          Redirecting in {countdown}...
        </Text>
      </VStack>
    </Container>
  )
}
