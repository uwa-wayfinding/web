"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Box, CircularProgress } from "@mui/material"
import { authClient } from "@/lib/auth-client"
import { isNullish } from "remeda"


export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession()
        if (isNullish(session.data)) {
          throw new Error("No session found")
        }
        router.push("/")
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      })
    } catch (error) {
      console.error("Error signing in with Google:", error)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Button
        variant="contained"
        onClick={handleGoogleSignIn}
        size="large"
      >
        Sign in with Google
      </Button>
    </Box>
  )
} 