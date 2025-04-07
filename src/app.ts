import { Pinup } from 'pinup'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ path: ['.process', '.env'] })

import { Auth } from './components/auth/pin'
import { hot_reload_backend_client, ifdev } from './utils/debug'
import { User } from './components/user/pin'


// EXPERIMENTAL
process.on('uncaughtException', function (err) {
    console.log(err);
}); 

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

pinup.pin(Auth)
pinup.pin(User)


pinup.run({
    print_setup_config: true
});


ifdev(hot_reload_backend_client)