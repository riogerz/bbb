import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core"

// Existing schemas...

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Will store hashed password
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
})

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id").references(() => users.id),
  receiverId: serial("receiver_id").references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

export type User = typeof users.$inferSelect
export type Message = typeof messages.$inferSelect

