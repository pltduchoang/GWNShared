// root/pages/api/newsletters/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const newsletter = await prisma.newsletter.create({
                    data: req.body,
                });
                res.status(201).json(newsletter);
            } catch (error) {
                res.status(400).json({ error: "Failed to create the newsletter" });
            }
            break;
        case 'GET':
            try {
                const newsletters = await prisma.newsletter.findMany();
                res.status(200).json(newsletters);
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve the newsletters" });
            }
            break;
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
