'use client'

import Link from "next/link"

const LaunchCalendarButton = () => {
  return (
    <Link
        href='/sign-in'
        className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105 animate-bounce-short"
      >
        Get Started
      </Link>
  )
}

export default LaunchCalendarButton