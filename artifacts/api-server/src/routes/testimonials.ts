import { Router, type IRouter, type Request, type Response } from "express";
import { asc } from "drizzle-orm";
import { db, testimonialsTable } from "@workspace/db";
import { ListTestimonialsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get(
  "/testimonials",
  async (_req: Request, res: Response): Promise<void> => {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .orderBy(asc(testimonialsTable.sortOrder));

    const data = ListTestimonialsResponse.parse(
      testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        location: t.location,
        rating: t.rating,
        quote: t.quote,
      })),
    );
    res.json(data);
  },
);

export default router;
