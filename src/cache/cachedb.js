const { createClient } = require('redis');
const redisdb = async (callBack) => {
    console.log("Access into redisdb");
    /* Parameters*/
    const redis_port = '6379'
    const redis_host = '10.140.8.126'
    const redis_url = '127.0.0.1:6379'

    /*Cunnection*/

    const client = createClient({
        url: `redis://:@${redis_url}:${redis_port}`
    });
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('key', 'value');
    const value = await client.get('key');


    callBack()
}

module.exports = { redisdb }