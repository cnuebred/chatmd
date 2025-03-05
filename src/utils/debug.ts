export const devlog = (callback: () => {}) => {
  if (process.env.MODE == 'dev'){
    callback()
  }
}