import * as express from 'express';

export class ExpressServer {
  constructor(private readonly instance: express.Application) {}

  getInstance(): express.Application {
    return this.instance;
  }
}
