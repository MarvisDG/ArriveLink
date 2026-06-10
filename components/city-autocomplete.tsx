'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'

interface City {
  id: number
  name: string
  state?: string
}

interface CityAutocompleteProps {
  id: string
  value: string
  onChange: (cityId: string) => void
  placeholder?: string
}

export function CityAutocomplete({
  id,
  value,
  onChange,
  placeholder = 'Search cities...',
}: CityAutocompleteProps) {
  const [input, setInput] = useState('')
  const [cities, setCities] = useState<City[]>([])
  const [filtered, setFiltered] = useState<City[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  // Fetch cities on input change
  useEffect(() => {
    const fetchCities = async () => {
      if (!input || input.length < 1) {
        setFiltered([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/cities/autocomplete?q=${encodeURIComponent(input)}`)
        const data = await response.json()
        setFiltered(data.data || [])
      } catch (error) {
        console.error('[v0] Autocomplete fetch error:', error)
        setFiltered([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchCities, 300)
    return () => clearTimeout(timer)
  }, [input])

  const handleSelect = (city: City) => {
    setSelectedCity(city)
    setInput(city.name)
    onChange(city.id.toString())
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-3 text-sm text-slate-600 text-center">Loading...</div>
          )}

          {!loading && filtered.length === 0 && input && (
            <div className="p-3 text-sm text-slate-600 text-center">No cities found</div>
          )}

          {!loading && filtered.length === 0 && !input && (
            <div className="p-3 text-sm text-slate-600 text-center">Start typing...</div>
          )}

          {filtered.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full px-3 py-2 text-left hover:bg-slate-100 text-sm border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-slate-900">{city.name}</div>
              {city.state && (
                <div className="text-xs text-slate-600">{city.state}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
