import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Usage: router.post('/x', validateRequest(mySchema), handler)
// This is what stops malformed/malicious payloads before they touch the DB layer.
export default function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
