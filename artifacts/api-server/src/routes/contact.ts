import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import { CreateContactInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /contact
router.get("/contact", async (_req, res): Promise<void> => {
  const contacts = await db
    .select()
    .from(contactsTable)
    .orderBy(desc(contactsTable.createdAt));

  res.json(contacts);
});

// POST /contact
router.post("/contact", async (req, res): Promise<void> => {
  const parsed = CreateContactInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid contact body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values(parsed.data)
    .returning();

  req.log.info({ contactId: contact.id }, "Contact inquiry submitted");
  res.status(201).json(contact);
});

export default router;
