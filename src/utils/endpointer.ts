
export const API_URL = (api_path: string): string => {
  let api_version = process.env['CHATMD_API_VERSION']
  if (!api_version){
    api_version = 'API_VERSION'
  }
  return `api/v${api_version}/${api_path}`
}
