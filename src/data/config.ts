import * as dotenv from 'dotenv'

dotenv.config();

export const {
    ENV,
    PORT,
    HOST,
    DB_HOST,
    DB_NAME,
    DB_TEST,
    DB_DEV,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_DAIL,
    WEBSITE,
    JWT_SECRET,
    BCRYPT_SECRET,
    BCRYPT_SALT,
    BCRYPT_HASH,
    STRIPE_ID,
    STRIPE_KEY,
    PAYPAL_ID,
    PAYPAL_KEY,
    FAWRY_ID,
    FAWRY_KEY,
    PAYONEER_ID,
    PAYONEER_KEY,
    ACCEPT_ID,
    ACCEPT_KEY,
} = process.env


export const uToken: string = "tfindothekmissingehiddenn"