import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method } = req;
    const { userId, page = 0, pageSize = 30 } = req.query;

    switch (method) {
        case 'GET':
            if (userId) {
                try {
                    const transactions = await prisma.transactionHistory.findMany({
                        where: {
                            userID: userId // Assume userId is the correct type
                        },
                    });
                    res.status(200).json(transactions);
                } catch (error) {
                    res.status(500).json({ message: "Failed to retrieve transactions for the user", error: error.message });
                }
            } else {
                try {
                    const transactions = await prisma.transactionHistory.findMany({
                        skip: parseInt(page) * parseInt(pageSize),
                        take: parseInt(pageSize),
                    });
                    const totalTransactions = await prisma.transactionHistory.count();
                    res.status(200).json({ transactions, totalTransactions });
                } catch (error) {
                    res.status(500).json({ message: "Failed to retrieve transactions", error: error.message });
                }
            }
            break;
        case 'POST':
            try {
                const transaction = await prisma.transactionHistory.create({
                    data: req.body,
                });
                res.status(201).json(transaction);
            } catch (error) {
                res.status(400).json({ message: "Failed to create transaction", error: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
