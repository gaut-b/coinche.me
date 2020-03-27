const Redis = require('ioredis');
const redisURL = "redis://redis";
const redisInstance = new Redis(redisURL);

export const redisKey = 'XXXXXX';

export default redisInstance;