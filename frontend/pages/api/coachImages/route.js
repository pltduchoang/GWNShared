//pages/api/coachImages/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            try {
                const coachImage = await prisma.coachImage.create({
                    data: req.body,
                });
                res.status(201).json(coachImage);
            } catch (error) {
                res.status(400).json({ error: "Failed to create the coach image" });
            }
            break;
        case 'GET':
            try {
                const coachImages = await prisma.coachImage.findMany();
                res.status(200).json(coachImages);
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve coach images" });
            }
            break;
        default:
            res.setHeader('Allow', ['POST', 'GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}