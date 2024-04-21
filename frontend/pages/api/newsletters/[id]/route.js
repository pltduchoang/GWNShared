// root/pages/api/newsletters/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const newsletter = await prisma.newsletter.findUnique({
                    where: { id: parseInt(id) },
                });
                if (newsletter) {
                    res.status(200).json(newsletter);
                } else {
                    res.status(404).json({ error: "Newsletter not found" });
                }
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve the newsletter" });
            }
            break;
        case 'PUT':
            try {
                const updatedNewsletter = await prisma.newsletter.update({
                    where: { id: parseInt(id) },
                    data: req.body,
                });
                res.status(200).json(updatedNewsletter);
            } catch (error) {
                res.status(400).json({ error: "Failed to update the newsletter" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.newsletter.delete({
                    where: { id: parseInt(id) },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete the newsletter" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
