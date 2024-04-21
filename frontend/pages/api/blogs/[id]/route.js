import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage }).single('photo');

    const prisma = new PrismaClient();
    const postId = req.query.id;
    
    if (req.method === 'GET') {
        if (!postId) {
            return res.status(400).json({ error: 'Missing post ID' });
        }

        try {
            const post = await prisma.blog.findUnique({
                where: {
                    id: parseInt(postId),
                },
            });
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.status(200).json(post);
        } catch (error) {
            console.error('Failed to retrieve post:', error);
            res.status(500).json({ error: 'Failed to retrieve post' });
        }

        
    } else if (req.method === 'PUT') {
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ error: 'Failed to upload file' });
            }

            const { title, content } = req.body;
            const photo = req.file ? `/uploads/${req.file.filename}` : null;

            if (!postId) {
                return res.status(400).json({ error: 'Missing post ID' });
            }

            if (!title || !content) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            try {
                const updatedPost = await prisma.blog.update({
                    where: {
                        id: parseInt(postId),
                    },
                    data: {
                        title,
                        content,
                        photo,
                    },
                });
                res.status(200).json(updatedPost);
            } catch (error) {
                console.error('Failed to update post:', error);
                res.status(500).json({ error: 'Failed to update post' });
            }
        });

    } else if (req.method === 'DELETE') {
        if (!postId) {
            return res.status(400).json({ error: 'Missing post ID' });
        }

        try {
            await prisma.blog.delete({
                where: {
                    id: parseInt(postId),
                },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Failed to delete post:', error);
            res.status(500).json({ error: 'Failed to delete post' });
        }


    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}