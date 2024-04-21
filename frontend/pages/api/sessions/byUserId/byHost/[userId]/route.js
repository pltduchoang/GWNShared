// pages/api/session/byUserId/byHost/[userId]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      // Example: Fetch sessions hosted by the user
      const sessions = await prisma.meetingSession.findMany({
        where: {
            hostingBy: userId,
        },
      });
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: `Failed to retrieve sessions for user ${userId}` });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed for user-based session operations`);
  }
}
