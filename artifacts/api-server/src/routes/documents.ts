import path from "path";
import fs from "fs";
import { Router, type IRouter } from "express";
import multer from "multer";
import { eq } from "drizzle-orm";
import { db, documentsTable, applicationsTable } from "@workspace/db";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_MIMETYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_DOC_TYPES = [
  "cv",
  "passport-id",
  "right-to-work",
  "dbs-certificate",
  "national-insurance",
  "proof-of-address",
  "cleaning-certificate",
  "other",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed. Please upload a PDF, Word document, or image."));
    }
  },
});

const router: IRouter = Router();

// GET /applications/:id/documents
router.get("/applications/:id/documents", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const appId = parseInt(raw, 10);
  if (isNaN(appId)) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const documents = await db
    .select()
    .from(documentsTable)
    .where(eq(documentsTable.applicationId, appId));

  res.json(documents);
});

// POST /applications/:id/documents
router.post(
  "/applications/:id/documents",
  upload.single("file"),
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const appId = parseInt(raw, 10);
    if (isNaN(appId)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    // Verify application exists
    const [application] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId));

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    const documentType = (req.query.documentType as string) || (req.body.documentType as string);
    if (!documentType || !ALLOWED_DOC_TYPES.includes(documentType)) {
      res.status(400).json({ error: "Invalid or missing documentType" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const [document] = await db
      .insert(documentsTable)
      .values({
        applicationId: appId,
        documentType,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.filename,
      })
      .returning();

    req.log.info({ documentId: document.id, applicationId: appId, documentType }, "Document uploaded");
    res.status(201).json(document);
  }
);

export default router;
