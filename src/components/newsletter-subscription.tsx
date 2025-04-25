  "use client"

  import type React from "react"
  import { useState } from "react"
  import { Button } from "@/components/ui/button"

  export const NewsletterSubscription = () => {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setStatus("loading")
      setMessage("")

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message || "Successfully subscribed!")
          setEmail("")
        } else {
          setStatus("error")
          setMessage(data.error || "An error occurred. Please try again.")
        }
      } catch {
        setStatus("error")
        setMessage("An error occurred. Please try again.")
      }
    }

    return (
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-full px-4 py-2 text-slate-900 dark:text-slate-100 flex-grow"
        />
        <Button type="submit" className="rounded-full px-8" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
        {status === "error" && <p className="text-red-500">{message}</p>}
        {status === "success" && <p className="text-green-500">{message}</p>}
      </form>
    )
  }
