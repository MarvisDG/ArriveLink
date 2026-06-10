'use server'

import { db } from '@/lib/db'
import { cities, companies, routes } from '@/lib/db/schema'

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingCities = await db.select().from(cities).limit(1)
    if (existingCities.length > 0) {
      return { success: true, message: 'Database already seeded' }
    }

    // Seed cities
    const seededCities = await db
      .insert(cities)
      .values([
        { name: 'Lagos', state: 'Lagos', slug: 'lagos' },
        { name: 'Abuja', state: 'FCT', slug: 'abuja' },
        { name: 'Ibadan', state: 'Oyo', slug: 'ibadan' },
        { name: 'Kano', state: 'Kano', slug: 'kano' },
        { name: 'Port Harcourt', state: 'Rivers', slug: 'port-harcourt' },
        { name: 'Benin City', state: 'Edo', slug: 'benin-city' },
        { name: 'Calabar', state: 'Cross River', slug: 'calabar' },
        { name: 'Ilorin', state: 'Kwara', slug: 'ilorin' },
      ])
      .returning()

    // Seed companies
    const seededCompanies = await db
      .insert(companies)
      .values([
        {
          name: 'GUO Transport',
          description: 'Premium intercity bus service with comfortable seating',
          logoUrl: '/logos/guo.png',
          rating: 4.5,
          totalReviews: 245,
        },
        {
          name: 'Dangote Buses',
          description: 'Reliable and affordable transport solutions',
          logoUrl: '/logos/dangote.png',
          rating: 4.2,
          totalReviews: 189,
        },
        {
          name: 'Peace Mass Transit',
          description: 'Dedicated to passenger comfort and safety',
          logoUrl: '/logos/peace.png',
          rating: 4.7,
          totalReviews: 312,
        },
        {
          name: 'ABC Transport',
          description: 'Modern fleet with air conditioning',
          logoUrl: '/logos/abc.png',
          rating: 4.3,
          totalReviews: 156,
        },
      ])
      .returning()

    // Seed routes
    const lagosId = seededCities[0].id
    const abujaId = seededCities[1].id
    const ibadanId = seededCities[2].id
    const phId = seededCities[4].id

    await db.insert(routes).values([
      {
        originCityId: lagosId,
        destinationCityId: abujaId,
        companyId: seededCompanies[0].id,
        departureTime: '07:00',
        arrivalTime: '11:30',
        fare: 5500.00,
        busType: 'AC Luxury',
      },
      {
        originCityId: lagosId,
        destinationCityId: abujaId,
        companyId: seededCompanies[1].id,
        departureTime: '08:00',
        arrivalTime: '12:00',
        fare: 4500.00,
        busType: 'Standard',
      },
      {
        originCityId: lagosId,
        destinationCityId: abujaId,
        companyId: seededCompanies[2].id,
        departureTime: '06:30',
        arrivalTime: '11:00',
        fare: 5200.00,
        busType: 'AC Luxury',
      },
      {
        originCityId: abujaId,
        destinationCityId: lagosId,
        companyId: seededCompanies[0].id,
        departureTime: '09:00',
        arrivalTime: '13:30',
        fare: 5500.00,
        busType: 'AC Luxury',
      },
      {
        originCityId: lagosId,
        destinationCityId: ibadanId,
        companyId: seededCompanies[3].id,
        departureTime: '10:00',
        arrivalTime: '12:00',
        fare: 2500.00,
        busType: 'Standard',
      },
      {
        originCityId: lagosId,
        destinationCityId: phId,
        companyId: seededCompanies[1].id,
        departureTime: '07:00',
        arrivalTime: '14:00',
        fare: 6500.00,
        busType: 'AC Luxury',
      },
    ])

    return {
      success: true,
      message: 'Database seeded successfully',
      citiesCount: seededCities.length,
      companiesCount: seededCompanies.length,
    }
  } catch (error) {
    console.error('Seeding error:', error)
    throw new Error('Failed to seed database')
  }
}
