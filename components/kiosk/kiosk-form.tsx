"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"

interface KioskFormProps {
  onSuccess: () => void
  onReset: () => void
}

interface FormData {
  name: string
  phone: string
  email: string
  interest: string
  emailOptIn: boolean
  smsOptIn: boolean
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
}

export function KioskForm({ onSuccess, onReset }: KioskFormProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    interest: "",
    emailOptIn: true,
    smsOptIn: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const interestOptions = [
    { value: "design", label: "Design Consultation" },
    { value: "product", label: "Product Demo" },
    { value: "partner", label: "Partnership" },
    { value: "other", label: "Other" },
  ]

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.name.trim()) {
      newErrors.name = "Please enter your name"
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your phone number"
    } else if (!/^[\d+\-\s()]{7,15}$/.test(form.phone)) {
      newErrors.phone = "Invalid phone number format"
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    // Mock submit delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    onSuccess()
  }

  const inputClasses =
    "min-h-[56px] w-full rounded-lg border bg-surface-2 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Check-in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please fill in your information
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            className={`${inputClasses} ${errors.name ? "border-destructive ring-1 ring-destructive/50" : "border-border hover:border-primary/40"}`}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Phone <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            placeholder="138 0000 0000"
            value={form.phone}
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value })
              if (errors.phone) setErrors({ ...errors, phone: undefined })
            }}
            className={`${inputClasses} ${errors.phone ? "border-destructive ring-1 ring-destructive/50" : "border-border hover:border-primary/40"}`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value })
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`${inputClasses} ${errors.email ? "border-destructive ring-1 ring-destructive/50" : "border-border hover:border-primary/40"}`}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Interest */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Interest
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, interest: opt.value })}
                className={`min-h-[48px] rounded-lg border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  form.interest === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface-2 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Consent */}
        <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-surface-1 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Communication Preferences
          </p>
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setForm({ ...form, emailOptIn: !form.emailOptIn })}
              className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                form.emailOptIn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-2"
              }`}
            >
              {form.emailOptIn && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-foreground">
              Agree to receive email notifications
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setForm({ ...form, smsOptIn: !form.smsOptIn })}
              className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                form.smsOptIn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-2"
              }`}
            >
              {form.smsOptIn && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-foreground">
              Agree to receive SMS notifications
            </span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="group relative min-h-[56px] w-full overflow-hidden rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.25)] active:scale-[0.98] disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Check-in"
        )}
      </button>
    </div>
  )
}
