import * as express from 'express';
import { HelloService } from './hello.service';

export class Hellohandler {
  constructor(private readonly helloService: HelloService) {}

  async handle(req: express.Request, res: express.Response): Promise<any> {
    const greeting = await this.helloService.greeting();
    res.send(greeting);
  }
}
