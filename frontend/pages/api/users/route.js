// root/pages/api/users/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 0;
  const pageSize = parseInt(req.query.pageSize) || 30;

  switch (req.method) {
    case 'GET':
      // first check if the user wants to retrieve subscribed users and return them
      if (req.query.subscribed === 'true') {
        try {
          const subscribedUsers = await prisma.user.findMany({
            where: {
              subscribeNewsletter: true,
            },
            select: {
              id: true,
              email: true,
            },
          });
          res.status(200).json(subscribedUsers);
        } catch (error) {
          res.status(500).json({ error: "Failed to retrieve subscribed users" });
        }
        return; // Prevent further execution
      }
      //Retrieve all staff
      else if (req.query.staff === 'true') {
        try {
          const staff = await prisma.user.findMany({
            where: {
              role: 'staff',
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          });
          res.status(200).json(staff);
        } catch (error) {
          res.status(500).json({ error: "Failed to retrieve staff" });
        }
        return; // Prevent further execution
      }

      // Retrieve a user by email
      else if (req.query.email) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: req.query.email,
            },
          });
          user ? res.status(200).json(user) : res.status(404).json({ error: "User not found" });
        } catch (error) {
          res.status(500).json({ error: "Failed to retrieve user" });
        }
        return; // Prevent further execution
      } else if (req.query.search) {
        // Search functionality across firstName, lastName, email, and phone
        try {
          const results = await prisma.user.findMany({
            where: {
              OR: [
                { firstName: { contains: req.query.search} },
                { lastName: { contains: req.query.search} },
                { email: { contains: req.query.search} },
                { phoneNumber: { contains: req.query.search} },
              ],
            },
            skip: page * pageSize,
            take: pageSize,
          });
          res.status(200).json(results);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      // Retrieve all users
      try {
        const users = await prisma.user.findMany({
          skip: page * pageSize,
          take: pageSize,
          orderBy: {
            createdAt: 'desc', // Assuming you want to order by creation date
          },
        });
        const totalUsers = await prisma.user.count(); // Get the total count of users for pagination
        res.status(200).json({ users, totalUsers });
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
      }
      break;
      case 'POST':
      // Create a new user
      try {
        const user = await prisma.user.create({
          data: req.body,
        });
        res.status(201).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
