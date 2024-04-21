// pages/api/session/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query; // Retrieve query parameters
    try {
      // Query for sessions within the specified date range
      const sessions = await prisma.meetingSession.findMany({
        where: {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve sessions" });
    }
  } else if (req.method === 'POST') {
    try {
      const session = await prisma.meetingSession.create({
        data: req.body,
      });
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Failed to create session" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
