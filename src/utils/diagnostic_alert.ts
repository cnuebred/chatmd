

export const send_diagnostic_message = (object: {[index:string]: any}) => {
  const params = {
    username: "CHATMD",
    avatar_url: "",
    content: Object.entries(object).map(([key, value]) => {
      return `- ${key}: ${value}`
    }).join('\n')
}
  fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.error(err);
  })
  }