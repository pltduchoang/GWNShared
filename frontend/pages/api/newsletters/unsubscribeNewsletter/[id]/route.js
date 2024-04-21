// root/pages/api/unsubscribeNewsletter/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Assuming each user has a `subscribedNewsletter` field indicating their subscription status
      const unsubscribe = await prisma.user.update({
        where: { id: id },
        data: { subscribeNewsletter: false },
      });
      // Optionally, provide a message or redirect after successful unsubscription
      res.status(200).json({ message: 'Unsubscribed successfully' });
 // Redirect to a page indicating successful unsubscription
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
