import { Pinup } from 'pinup'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()


const app = express()
const pinup = new Pinup(app, {
    port: parseInt(process.env.BACKEND_PORT),
    auth: {
        secret: process.env.BACKEND_AUTH_SECRET
    },
    logger: true,
    logger_file: './server.log'
})

pinup.run({
    print_setup_config: true
})
