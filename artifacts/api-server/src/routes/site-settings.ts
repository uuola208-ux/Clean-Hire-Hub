import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteSettingsTable } from "@workspace/db";
import { UpdateSiteSettingsBody } from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();
const SETTINGS_ID = 1;

const defaultSettings = {
  companyName: "TJ FreshSpace",
  contactEmail: "hello@tjfreshspace.co.uk",
  phone: "020 7946 0000",
  address: "London, United Kingdom",
  officeHours: "Monday - Friday, 09:00 - 17:30",
  heroTitle: "A fresh start for your cleaning career.",
  heroSubtitle: "Find rewarding cleaning work with a team that values you.",
  heroImageUrl: "",
  aboutTitle: "Raising the standard of recruitment.",
  aboutDescription: "At TJ FreshSpace, we believe that exceptional cleaning services start with exceptional people.",
  aboutImageUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
};

async function ensureSettings() {
  await db.insert(siteSettingsTable)
    .values({ id: SETTINGS_ID, ...defaultSettings })
    .onConflictDoNothing({ target: siteSettingsTable.id });
  const [settings] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, SETTINGS_ID));
  return settings;
}

router.get("/site-settings", async (_req, res): Promise<void> => {
  const settings = await ensureSettings();
  res.json(settings);
});

router.patch("/site-settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSiteSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  for (const field of ["heroImageUrl", "aboutImageUrl", "facebookUrl", "instagramUrl", "linkedinUrl"] as const) {
    const value = parsed.data[field];
    if (value && !/^https?:\/\//i.test(value)) {
      res.status(400).json({ error: `${field} must be an http or https URL, or left blank.` });
      return;
    }
  }

  await ensureSettings();
  const [settings] = await db.update(siteSettingsTable)
    .set(parsed.data)
    .where(eq(siteSettingsTable.id, SETTINGS_ID))
    .returning();
  res.json(settings);
});

export default router;