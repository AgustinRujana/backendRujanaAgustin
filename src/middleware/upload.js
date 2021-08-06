import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage';

import config from '../../config.js';

const storage = new GridFsStorage({
    url: config.DATABASE_URL,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}${file.originalname}`,
        };
    },
});

export default multer({ storage }).single('file')