//root/pages/api/sessions/byDate/[date]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract the date from the request URL
      const { date } = req.query;

      // Convert the received date to a Date object and calculate the next day
      const requestedDate = new Date(`${date}T00:00:00.000Z`);
      const nextDay = new Date(requestedDate);
      nextDay.setDate(requestedDate.getDate() + 1); // Increment the day by 1

      // Fetch sessions from the requested date to the end of the next day
      // This accounts for any sessions that might have been stored as the next day in UTC
      const sessions = await prisma.meetingSession.findMany({
        where: {
          AND: [
            {
              startTime: {
                gte: requestedDate,
              },
            },
            {
              startTime: {
                lt: nextDay,
              },
            },
          ],
        },
      });

      // Respond with the found sessions
      res.status(200).json(sessions);
    } catch (error) {
      console.error('Error fetching sessions by date:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle other HTTP methods or return an error
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
