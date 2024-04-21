// root/pages/api/users/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // Get a specific user
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
      break;
    case 'PUT':
      // Update a user
      try {
        const updatedUser = await prisma.user.update({
          where: { id: id },
          data: req.body,
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;
    case 'DELETE':
      // Delete a user
      try {
        await prisma.user.delete({
          where: { id: id },
        });
        res.status(204).end();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
