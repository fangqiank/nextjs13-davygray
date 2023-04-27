'use client'
import { Button } from "@/components/Button"
import { signOut } from "next-auth/react"

const Home = async () => {
  return (
    <Button
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  )
}

export default Home
