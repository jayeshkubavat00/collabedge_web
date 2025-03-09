"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { registerUser } from "../actions/register"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const RegisterSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterFormValues = z.infer<typeof RegisterSchema>

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))

    const result = await registerUser(formData)

    if (result.error) {
      setSubmitError(result.error)
    } else if (result.success) {
      setSubmitSuccess(true)
    }

    setIsSubmitting(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" {...register("fullname")} />
            {errors.fullname && <p className="text-sm text-red-500">{errors.fullname.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {submitError && <p className="text-sm text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-green-500">Registration successful!</p>}
      </CardFooter>
    </Card>
  )
}
