import { Pinup } from 'pinup'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config({ path: ['.process', '.env'] })


const app = express()
const pinup = new Pinup(app, {
    port: parseInt(process.env.BACKEND_PORT),
    auth: {
        secret: process.env.BACKEND_AUTH_SECRET
    },
    logger: true,
    logger_file: './server.log'
})

console.log(`APP VERSION: ${process.env.CHATMD_VERSION}`)

pinup.run({
    print_setup_config: true
})
