import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const get_account_data = async (hash: string) => {
  const select = await prisma.user.findFirst({
    where: {
      hash: hash
    }
  })
  delete select.password
  return select
}


export const is_account_exist = async (hash: string) => {
  return get_account_data(hash) != null
}