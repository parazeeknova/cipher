'use client'

import { useForm } from '@tanstack/react-form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { GlassmorphicSpinner } from '../ui/GlassmorphicComponents'

interface ClerkUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string | null
  primaryEmailAddress?: {
    emailAddress?: string | null
  } | null
}

export function OnboardingForm({ user, onComplete }: { user: ClerkUser, onComplete: () => void }) {
  const router = useRouter()
  const utils = trpc.useUtils()

  const onboardMutation = trpc.onboardUser.useMutation({
    onSuccess: () => {
      onComplete()
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.primaryEmailAddress?.emailAddress)
        return

      await onboardMutation.mutateAsync({
        username: value.username,
        email: user.primaryEmailAddress.emailAddress,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        imageUrl: user.imageUrl || undefined,
      })
    },
  })

  const handleRefreshCheck = async () => {
    await utils.getUser.invalidate()
    const result = await utils.getUser.fetch()
    if (result) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Welcome to Cipher!
          </h2>
          <p className="text-gray-600">
            Choose a unique username to complete your profile
          </p>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          {user.imageUrl && (
            <Image
              width="1080"
              height="1920"
              src={user.imageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
          )}
          <div>
            <div className="text-gray-600 font-medium">
              {user.firstName}
              {' '}
              {user.lastName}
            </div>
            <div className="text-gray-500 text-sm">
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.length < 3) {
                  return 'Username must be at least 3 characters'
                }
                if (value.length > 50) {
                  return 'Username must be less than 50 characters'
                }
                if (!/^\w+$/.test(value)) {
                  return 'Username can only contain letters, numbers, and underscores'
                }
                return undefined
              },
            }}
          >
            {field => (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                    disabled={onboardMutation.isPending}
                  />
                  {onboardMutation.isPending && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <GlassmorphicSpinner size="sm" />
                    </div>
                  )}
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <div className="mt-2 text-red-400 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
                {field.state.value.length >= 3
                  && !field.state.meta.errors.length && (
                  <div className="mt-2 text-green-400 text-sm">
                    ✓ Username looks good
                  </div>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || onboardMutation.isPending}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-gray-600 font-medium text-lg shadow-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {onboardMutation.isPending || isSubmitting
                  ? <GlassmorphicSpinner size="sm" />
                  : null}

                <span className="relative z-10">
                  {onboardMutation.isPending || isSubmitting
                    ? 'Creating Account...'
                    : 'Complete Setup'}
                </span>
              </button>
            )}
          </form.Subscribe>

          {onboardMutation.error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <div className="text-red-400 text-sm">
                {onboardMutation.error.message}
                {onboardMutation.error.message.includes('already exists') && (
                  <div className="mt-2">
                    <button
                      onClick={handleRefreshCheck}
                      className="text-blue-400 underline text-xs"
                    >
                      Click here to go to dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          By continuing, you agree to our terms and conditions
        </p>
      </div>
    </div>
  )
}
