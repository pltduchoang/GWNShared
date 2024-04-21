import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import sharp from 'sharp';

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
    
    if (req.method === 'GET') {
        try {
            const posts = await prisma.blog.findMany();
            res.status(200).json(posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            res.status(500).json({ error: 'Failed to fetch posts' });
        }

    } else if (req.method === 'POST') {
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ error: 'Failed to upload file' });
            }

            const { title, content } = req.body;
            const photo = req.file ? `/uploads/${req.file.filename}` : null;

            if (!title || !content) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            try {
                // const photoPath = path.join(uploadDir, photoFilename);
                // const resizedPhotoPath = path.join(uploadDir, 'resized-' + photoFilename);
                
                // await sharp(photoPath)
                //     .resize({ width: 800, height: 600, fit: 'inside' })
                //     .toFile(resizedPhotoPath);

                const newPost = await prisma.blog.create({
                    data: {
                        title,
                        content,
                        photo,
                    },
                });
                res.status(200).json(newPost);
            } catch (error) {
                console.error('Failed to create post:', error);
                res.status(500).json({ error: 'Failed to create post' });
            }
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}