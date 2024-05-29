import dotenv from 'dotenv'

dotenv.config({path:'.env'})

//ตรงนี้
export const PORT = 3000
export const JWT_SECRET = process.env.JWT_SECRET!