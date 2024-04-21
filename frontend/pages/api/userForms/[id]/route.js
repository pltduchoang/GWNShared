// pages/api/userForms/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const userForm = await prisma.userForm.findUnique({
                    where: { id: parseInt(id) },
                });
                userForm ? res.status(200).json(userForm) : res.status(404).json({ error: 'User form not found' });
            } catch (error) {
                res.status(500).json({ error: "Failed to retrieve user form" });
            }
            break;
        case 'PUT':
            try {
                const userForm = await prisma.userForm.update({
                    where: { id: parseInt(id) },
                    data: req.body,
                });
                res.status(200).json(userForm);
            } catch (error) {
                res.status(400).json({ error: "Failed to update user form" });
            }
            break;
        case 'DELETE':
            try {
                await prisma.userForm.delete({
                    where: { id: parseInt(id) },
                });
                res.status(204).end();
            } catch (error) {
                res.status(400).json({ error: "Failed to delete user form" });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
