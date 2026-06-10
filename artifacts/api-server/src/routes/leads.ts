import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  newsletterSubscribersTable,
  contactMessagesTable,
} from "@workspace/db";
import { SubscribeNewsletterBody, SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post(
  "/newsletter",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = SubscribeNewsletterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid newsletter input" });
      return;
    }

    await db
      .insert(newsletterSubscribersTable)
      .values({
        name: parsed.data.name ?? null,
        email: parsed.data.email,
      })
      .onConflictDoNothing({ target: newsletterSubscribersTable.email });

    res
      .status(201)
      .json({ success: true, message: "You're subscribed. Welcome to Modern Muse." });
  },
);

router.post(
  "/contact",
  async (req: Request, res: Response): Promise<void> => {
    const parsed = SubmitContactBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid contact input" });
      return;
    }

    await db.insert(contactMessagesTable).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });

    res
      .status(201)
      .json({ success: true, message: "Thank you. We'll be in touch shortly." });
  },
);

export default router;
