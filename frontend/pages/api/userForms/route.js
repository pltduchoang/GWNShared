// pages/api/userForms/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { userId } = req.query;

    if (userId) {
        try {
            const userForms = await prisma.userForm.findMany({
                where: { userID: userId },
            });
            console.log('User forms retrieved');
            return res.status(200).json(userForms);
        } catch (error) {
            console.log('Error retrieving user forms:', error);
            return res.status(500).json({ error: "Failed to retrieve user forms for the specified user" });
        }
    }

    switch (req.method) {
        case 'POST':
            try {
                const userForm = await prisma.userForm.create({
                    data: req.body,
                });
                console.log('User form created:', userForm);
                res.status(201).json(userForm);
            } catch (error) {
                console.error('Error creating user form:', error);
                res.status(400).json({ error: "Failed to create user form" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
