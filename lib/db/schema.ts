import { pgTable, text, timestamp, boolean, serial, integer, numeric, time } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state'),
  slug: text('slug').unique(),
})

export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logoUrl'),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0'),
  totalReviews: integer('totalReviews').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  originCityId: integer('originCityId').notNull(),
  destinationCityId: integer('destinationCityId').notNull(),
  companyId: integer('companyId').notNull(),
  departureTime: time('departureTime'),
  arrivalTime: time('arrivalTime'),
  fare: numeric('fare', { precision: 10, scale: 2 }),
  busType: text('busType'),
  createdAt: timestamp('createdAt').defaultNow(),
})

export const unlocks = pgTable('unlocks', {
  id: serial('id').primaryKey(),
  routeId: integer('routeId').notNull(),
  userId: text('userId').notNull(),
  companyPhone: text('companyPhone'),
  companyEmail: text('companyEmail'),
  companyWhatsapp: text('companyWhatsapp'),
  unlockedAt: timestamp('unlockedAt').defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  companyId: integer('companyId').notNull(),
  userId: text('userId').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt').defaultNow(),
})

export const featuredListings = pgTable('featuredListings', {
  id: serial('id').primaryKey(),
  companyId: integer('companyId').notNull(),
  routeId: integer('routeId').notNull(),
  featuredUntil: timestamp('featuredUntil'),
  createdAt: timestamp('createdAt').defaultNow(),
})
