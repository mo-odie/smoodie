import express, { Request, Response } from 'express';
import cors from 'cors';
import { appRouter } from './trpc';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/trpc', createExpressMiddleware({ router: appRouter }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중이에요.`);
}); 