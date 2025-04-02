
export const API_URL = (api_path: string): string => {
  return `api/v${process.env.CHATMD_API_VERSION}/${api_path}`
}
