'use client'

import { useTheme } from 'next-themes'
import { PulseLoader } from 'react-spinners'

export const Loader = () => {
  const { theme } = useTheme()

  return <PulseLoader color={theme === 'light' ? '#00DCDC' : '#ffffff'} size={22} />
}
