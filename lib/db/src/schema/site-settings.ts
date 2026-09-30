import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  companyName: text("company_name").notNull().default("TJ FreshSpace"),
  contactEmail: text("contact_email").notNull().default("hello@tjfreshspace.co.uk"),
  phone: text("phone").notNull().default("020 7946 0000"),
  address: text("address").notNull().default("London, United Kingdom"),
  officeHours: text("office_hours").notNull().default("Monday - Friday, 09:00 - 17:30"),
  heroTitle: text("hero_title").notNull().default("A fresh start for your cleaning career."),
  heroSubtitle: text("hero_subtitle").notNull().default("Find rewarding cleaning work with a team that values you."),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  aboutTitle: text("about_title").notNull().default("Raising the standard of recruitment."),
  aboutDescription: text("about_description").notNull().default("At TJ FreshSpace, we believe that exceptional cleaning services start with exceptional people."),
  aboutImageUrl: text("about_image_url").notNull().default(""),
  facebookUrl: text("facebook_url").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;