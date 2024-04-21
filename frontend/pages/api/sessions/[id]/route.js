// pages/api/session/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const session = await prisma.meetingSession.findUnique({
        where: { id: parseInt(id) },
      });
      session ? res.status(200).json(session) : res.status(404).json({ error: "Session not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve session" });
    }
  } else if (req.method === 'PUT') {
    try {
      const session = await prisma.meetingSession.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(200).json(session);
    } catch (error) {
      res.status(400).json({ error: "Failed to update session" });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.meetingSession.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete session" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
