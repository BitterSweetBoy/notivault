import { Session as PrismaSession } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
      prismaSession?: PrismaSession;
    }
  }
}