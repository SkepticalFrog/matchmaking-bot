import { getClient } from './init';

(async () => {
  const client = await getClient();

  let rien = await client.get('prout');
  const obj = {
    pet: 'pue',
    rot: {
      bruit: true,
      vomi: 'peutetre',
    },
  }

  const res = await client.set('prout', JSON.stringify(obj, null, 0));
  console.log('res', res);

  await client.quit();
})();
