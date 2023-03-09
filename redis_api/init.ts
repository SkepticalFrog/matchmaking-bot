import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
const { REDIS_URL } = process.env;

const client = createClient({ url: REDIS_URL });

const init = async () => {
  if (client.isReady) return;

  client.on('error', err => console.log('Redis Client error', err));

  await client.connect();
};

const getClient = async () => {
  await init();
  return client;
};

export { getClient };
