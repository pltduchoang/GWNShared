//root/frontend/pages/api/testimony/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const testimony = await prisma.testimony.create({
                data: req.body,
            });
            res.status(201).json(testimony);
        } catch (error) {
            res.status(400).json({ error: "Failed to create the testimony" });
        }
    } else if (req.method === 'GET') {
        try {
            const testimonies = await prisma.testimony.findMany();
            res.status(200).json(testimonies);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve the testimonies" });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
