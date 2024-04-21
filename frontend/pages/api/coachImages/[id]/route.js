// File: /pages/api/coachImages/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const coachImage = await prisma.coachImage.findUnique({
                    where: { id: parseInt(id) },
                });
                if (coachImage) {
                    res.status(200).json(coachImage);
                } else {
                    res.status(404).json({ error: "Coach image not found" });
                }
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve the coach image" });
            }
            break;
        case 'PUT':
            try {
                const updatedCoachImage = await prisma.coachImage.update({
                    where: { id: parseInt(id) },
                    data: req.body,
                });
                res.status(200).json(updatedCoachImage);
            } catch (error) {
                res.status(400).json({ error: "Failed to update the coach image" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.coachImage.delete({
                    where: { id: parseInt(id) },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete the coach image" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
