//root/frontend/pages/api/testimony/[id]/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    let { id } = req.query;
    id = parseInt(id);

    switch (req.method) {
        case 'GET':
            try {
                const testimony = await prisma.testimony.findUnique({
                    where: { id },
                });
                testimony ? res.status(200).json(testimony) : res.status(404).json({ error: "Testimony not found" });
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve the testimony" });
            }
            break;

        case 'PUT':
            try {
                const updatedTestimony = await prisma.testimony.update({
                    where: { id },
                    data: req.body,
                });
                res.status(200).json(updatedTestimony);
            } catch (error) {
                res.status(400).json({ error: "Failed to update the testimony" });
            }
            break;

        case 'DELETE':
            try {
                await prisma.testimony.delete({
                    where: { id },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete the testimony" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
