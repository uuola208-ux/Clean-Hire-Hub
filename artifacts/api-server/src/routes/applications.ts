import { Router, type IRouter } from "express";
import { eq, ilike, and, sql, desc, count } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";
import {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  GetApplicationParams,
  DeleteApplicationParams,
  UpdateApplicationStatusParams,
  ListApplicationsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";

const router: IRouter = Router();

// GET /applications
router.get("/applications", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListApplicationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, position, search, page = 1, limit = 20 } = parsed.data;

  const conditions = [];
  if (status) conditions.push(eq(applicationsTable.status, status));
  if (position) conditions.push(eq(applicationsTable.positionApplying, position));
  if (search) {
    conditions.push(
      sql`(${ilike(applicationsTable.fullName, `%${search}%`)} OR ${ilike(applicationsTable.email, `%${search}%`)})`
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const [applications, totalResult] = await Promise.all([
    db
      .select()
      .from(applicationsTable)
      .where(where)
      .orderBy(desc(applicationsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(applicationsTable).where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  res.json({ applications, total, page, limit });
});

// POST /applications
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid application body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [application] = await db
    .insert(applicationsTable)
    .values({
      ...parsed.data,
      status: "pending",
    })
    .returning();

  req.log.info({ applicationId: application.id }, "New application submitted");
  res.status(201).json(application);
});

// GET /applications/stats
router.get("/applications/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [total, byStatus, byPosition, recent] = await Promise.all([
    db.select({ count: count() }).from(applicationsTable),
    db
      .select({ status: applicationsTable.status, count: count() })
      .from(applicationsTable)
      .groupBy(applicationsTable.status),
    db
      .select({ position: applicationsTable.positionApplying, count: count() })
      .from(applicationsTable)
      .groupBy(applicationsTable.positionApplying),
    db
      .select({ count: count() })
      .from(applicationsTable)
      .where(
        sql`${applicationsTable.createdAt} > NOW() - INTERVAL '7 days'`
      ),
  ]);

  res.json({
    total: total[0]?.count ?? 0,
    byStatus: byStatus.map((r) => ({ label: r.status, count: r.count })),
    byPosition: byPosition.map((r) => ({ label: r.position, count: r.count })),
    recentCount: recent[0]?.count ?? 0,
  });
});

// GET /applications/:id
router.get("/applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetApplicationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, params.data.id));

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(application);
});

// PATCH /applications/:id/status
router.patch("/applications/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateApplicationStatusParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const parsed = UpdateApplicationStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { status: parsed.data.status };
  if (parsed.data.adminNotes !== undefined) {
    updates.adminNotes = parsed.data.adminNotes;
  }

  const [application] = await db
    .update(applicationsTable)
    .set(updates)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  req.log.info({ applicationId: application.id, status: application.status }, "Application status updated");
  res.json(application);
});

// DELETE /applications/:id
router.delete("/applications/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteApplicationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const [application] = await db
    .delete(applicationsTable)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  req.log.info({ applicationId: params.data.id }, "Application deleted");
  res.sendStatus(204);
});

export default router;
