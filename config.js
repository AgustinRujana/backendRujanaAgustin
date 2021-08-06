import dotenv from 'dotenv'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: path.resolve(__dirname, '.env')
});


const config = {
    PORT: process.env.PORT|| 8080,
    DATABASE_URL: process.env.DATABASE_URL || 'DATABASE_URL',
    TOKEN_KEEP_ALIVE: process.env.TOKEN_KEEP_ALIVE || '1h',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'WHY THIS EXIST GOD',
    EMAIL: process.env.EMAIL || null,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || null,
}

export default config