'use client'
import { Button } from "@/components/Button"
import { signOut } from "next-auth/react"

const Home = async () => {
  console.log('hello world')
  return (
    <Button
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  )
}

export default Home
