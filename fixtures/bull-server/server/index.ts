import express from 'express';
import { monitor } from './queues';

const app = express();
const port = Number(process.env.PORT)

monitor.init().then(() => {
  app.use('/', monitor.router);
});

app.listen(port, () => {
  console.log(`Bull server fixture listening at http://localhost:${port}`);
});
