import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Authentication failed</h1>
      <p className="mt-2 text-slate-500">
        Something went wrong during sign in. Please try again.
      </p>
      <Link href="/login" className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white">
        Back to login
      </Link>
    </div>
  )
}