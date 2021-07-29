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
}

export default config