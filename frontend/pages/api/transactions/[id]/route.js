// pages/api/transactions/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const transaction = await prisma.transactionHistory.findUnique({
                    where: { paymentID: id },
                });
                transaction ? res.status(200).json(transaction) : res.status(404).json({ error: "Transaction not found" });
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve transaction" });
            }
            break;
        case 'PUT':
            try {
                const transaction = await prisma.transactionHistory.update({
                    where: { paymentID: id },
                    data: req.body,
                });
                res.status(200).json(transaction);
            } catch (error) {
                res.status(400).json({ error: "Failed to update transaction" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.transactionHistory.delete({
                    where: { paymentID: id },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete transaction" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
