import { login_method_e } from "@prisma/client"
import { discord_api_user_t, github_api_user_t } from "./auth"
import { prisma_client_error_handler } from "../../database/error_handler"
import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

export const is_account_exist = async (hash: string) => {
  const select = await prisma.user.findFirst({
    where: {
      hash: hash
    }
  })
  return select != null
}

export const get_account_data_to_login = async (hash: string) => {
  const select = await prisma.user.findFirst({
    where: {
      hash: hash
    }
  })
  return select
}

export const save_account_before_created_via_service = async  (
  hash:string, 
  method: login_method_e, 
  data: discord_api_user_t | github_api_user_t
) => {
  return await prisma_client_error_handler(async () => {
    return await prisma.user.create({
      data:{
        username: hash.slice(0, 6),
        hash: hash,
        email: data['email'] || '',
        verifed_email: false,
        login_method: method,
        password: randomBytes(128).toString('hex'),
        user_data: JSON.stringify(data),
        status: "ACTIVE"
      }
  })
})
}
