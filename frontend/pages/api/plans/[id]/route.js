// root/pages/api/plans/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    let { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const plan = await prisma.plan.findUnique({
                    where: { id: parseInt(id) },
                });
                if (plan) {
                    res.status(200).json(plan);
                } else {
                    res.status(404).json({ error: "Plan not found" });
                }
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve the plan" });
            }
            break;

        case 'PUT':
            try {
                const updatedPlan = await prisma.plan.update({
                    where: { id: parseInt(id) },
                    data: req.body,
                });
                res.status(200).json(updatedPlan);
            } catch (error) {
                res.status(400).json({ error: "Failed to update the plan" });
            }
            break;

        case 'DELETE':
            try {
                await prisma.plan.delete({
                    where: { id: parseInt(id) },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete the plan" });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
