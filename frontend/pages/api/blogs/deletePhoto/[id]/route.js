import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const fileName = req.query.fileName;

        if (!fileName) {
            return res.status(400).json({ error: 'Missing file name' });
        }

        const filePath = path.join(process.cwd(), 'public/uploads', fileName);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                res.status(200).json({ message: 'Photo deleted successfully' });
            } else {
                res.status(404).json({ error: 'Photo not found' });
            }
        } catch (error) {
            console.error('Failed to delete photo:', error);
            res.status(500).json({ error: 'Failed to delete photo' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}