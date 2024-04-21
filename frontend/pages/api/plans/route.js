// root/pages/api/plans/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const plan = await prisma.plan.create({
                data: req.body,
            });
            res.status(201).json(plan);
        } catch (error) {
            res.status(400).json({ error: "Failed to create the plan" });
        }
    } else if (req.method === 'GET') {
        try {
            const plans = await prisma.plan.findMany();
            res.status(200).json(plans);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve the plans" });
        }
    } else {
        // Handle any unsupported methods
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}