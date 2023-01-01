import * as dotenv from 'dotenv';
dotenv.config();
import { login } from 'masto';

const masto = await login({
  url: 'https://botsin.space',
  accessToken: process.env.ACCESS_TOKEN,
});

const stream = await masto.v1.stream.streamUser();

// Subscribe to updates
stream.on('update', async (status) => {
  const target = status.reblog ? status.reblog : status;
  if (target.visibility !== 'public') {
    return;
  }
  if (target.tags.find(s => s.name.toLowerCase() === 'fediblock')) {
    await masto.v1.statuses.reblog(target.id);
  }
});
  
// Subscribe to notifications
stream.on('notification', async (notification) => {
  if (notification.type === 'follow') {
    await masto.v1.accounts.follow(notification.account.id);
  }
});