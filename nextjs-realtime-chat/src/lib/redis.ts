type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export const fetchRedis = async (cmd: Command, ...args: (string | number)[]) => {
  const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL}/${cmd}/${args.join('/')}`

  const res = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Error executing Redis command: ${res.statusText}`)
  }

  const data = await res.json()
  //console.log(data)

	return data.result
}
