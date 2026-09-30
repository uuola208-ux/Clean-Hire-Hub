import path from "path";
import fs from "fs";
import { Readable } from "stream";
import { Router, type IRouter } from "express";
import { db, documentsTable, applicationsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import {
  RequestApplicationDocumentUploadUrlBody,
  RequestApplicationDocumentUploadUrlResponse,
  UploadDocumentBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/admin-auth";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "../lib/objectStorage";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
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

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

router.post(
  "/applications/:id/documents/upload-url",
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const appId = Number.parseInt(raw, 10);
    if (!Number.isInteger(appId)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const parsed = RequestApplicationDocumentUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { documentType, size, contentType } = parsed.data;
    if (
      !ALLOWED_DOC_TYPES.includes(documentType) ||
      !ALLOWED_MIMETYPES.includes(contentType) ||
      size > MAX_FILE_SIZE
    ) {
      res.status(400).json({ error: "Unsupported document type or file size." });
      return;
    }

    const [application] = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId));
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      res.json(
        RequestApplicationDocumentUploadUrlResponse.parse({
          uploadURL,
          objectPath,
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, "Error generating applicant document upload URL");
      res.status(500).json({ error: "Failed to prepare document upload" });
    }
  },
);

// GET /applications/:id/documents
router.get("/applications/:id/documents", requireAdmin, async (req, res): Promise<void> => {
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

router.get("/applications/:id/documents/:documentId/download", requireAdmin, async (req, res): Promise<void> => {
  const rawApplicationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawDocumentId = Array.isArray(req.params.documentId) ? req.params.documentId[0] : req.params.documentId;
  const applicationId = Number.parseInt(rawApplicationId, 10);
  const documentId = Number.parseInt(rawDocumentId, 10);
  if (!Number.isInteger(applicationId) || !Number.isInteger(documentId)) {
    res.status(400).json({ error: "Invalid application or document ID" });
    return;
  }

  const [document] = await db.select().from(documentsTable).where(
    and(eq(documentsTable.applicationId, applicationId), eq(documentsTable.id, documentId)),
  );
  if (!document || !document.filePath) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  const downloadName = path.basename(document.originalName).replace(/[\r\n"]/g, "_");
  if (document.filePath.startsWith("/objects/")) {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(document.filePath);
      const storedFile = await objectStorageService.downloadObject(objectFile, 0);
      if (!storedFile.body) {
        res.status(404).json({ error: "Document file not found" });
        return;
      }

      storedFile.headers.forEach((value, key) => res.setHeader(key, value));
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Type", document.mimeType || "application/octet-stream");
      res.attachment(downloadName);
      Readable.fromWeb(storedFile.body as ReadableStream<Uint8Array>).pipe(res);
      return;
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(404).json({ error: "Document file not found" });
        return;
      }
      req.log.error({ err: error, documentId }, "Error downloading applicant document");
      res.status(500).json({ error: "Failed to download document" });
      return;
    }
  }

  const fileName = path.basename(document.filePath);
  const fullPath = path.resolve(UPLOADS_DIR, fileName);
  if (path.dirname(fullPath) !== UPLOADS_DIR || !fs.existsSync(fullPath)) {
    res.status(404).json({ error: "Document file not found" });
    return;
  }

  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.download(fullPath, downloadName);
});

router.post(
  "/applications/:id/documents",
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const appId = parseInt(raw, 10);
    if (isNaN(appId)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const parsed = UploadDocumentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { documentType, originalName, mimeType, fileSize, filePath } = parsed.data;
    if (
      !ALLOWED_DOC_TYPES.includes(documentType) ||
      !ALLOWED_MIMETYPES.includes(mimeType) ||
      fileSize > MAX_FILE_SIZE
    ) {
      res.status(400).json({ error: "Unsupported document type or file size." });
      return;
    }

    const [application] = await db
      .select({ id: applicationsTable.id })
      .from(applicationsTable)
      .where(eq(applicationsTable.id, appId));
    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    let objectFile;
    let metadata;
    try {
      objectFile = await objectStorageService.getObjectEntityFile(filePath);
      [metadata] = await objectFile.getMetadata();
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(400).json({ error: "Uploaded document was not found in private storage." });
        return;
      }
      req.log.error({ err: error }, "Error validating uploaded applicant document");
      res.status(500).json({ error: "Failed to validate uploaded document" });
      return;
    }

    if (
      Number(metadata.size) !== fileSize ||
      metadata.contentType !== mimeType
    ) {
      res.status(400).json({ error: "Uploaded file metadata does not match." });
      return;
    }

    const [document] = await db
      .insert(documentsTable)
      .values({
        applicationId: appId,
        documentType,
        originalName,
        mimeType,
        fileSize,
        filePath,
      })
      .returning();

    req.log.info(
      { documentId: document.id, applicationId: appId, documentType },
      "Applicant document uploaded to private storage",
    );
    res.status(201).json(document);
  }
);

export default router;
