"use client"

import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material"
import Link from "next/link"
import { authClient, useSession } from "@/lib/auth-client"
import { ThemeToggle } from "./ThemeToggle"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1 }}>
          UWA Wayfinding
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          {!session ? (
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
          ) : (
            <>
              <Button color="inherit" 
                onClick={() => {
                  authClient.signOut()
                }}
              >
                Logout
              </Button>
              <Button color="inherit" component={Link} href="/dashboard">
                {session.user.name}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
} 