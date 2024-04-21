// pages/api/session/byUserId/byAttendee/[userId]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch sessions that the user is attending.
      // The implementation detail here would depend on how your relations are set up.
      // Assuming you have an 'attendees' field in your 'MeetingSession' model that relates to users.
      const sessions = await prisma.meetingSession.findMany({
        where: {
          attendees: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          attendees: true, // Optional: Include attendee details in the response
        },
      });
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: `Failed to retrieve sessions for attendee ${userId}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
