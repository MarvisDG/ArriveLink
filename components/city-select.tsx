'use client'

import { useEffect, useState } from 'react'
import { searchCities } from '@/app/actions/search'

interface CitySelectProps {
  value: number | null
  onChange: (value: number) => void
}

export default function CitySelect({ value, onChange }: CitySelectProps) {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.length > 0) {
        try {
          const results = await searchCities(input)
          setOptions(results)
        } catch (error) {
          console.error('Error searching cities:', error)
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [input])

  const handleSelect = (cityId: number, cityName: string) => {
    onChange(cityId)
    setInput(cityName)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder="Select city..."
        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-10">
          {options.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city.id, city.name)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-slate-700"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
