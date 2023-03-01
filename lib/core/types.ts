import { Server } from '../common/types';

export interface IApplication {
  init(): Promise<this>;
  getServer<T extends Server>(): T;
  getHttpServer(): any;
  listen(port: number | string, callback?: () => void): Promise<any>;
  listen(
    port: number | string,
    hostname: string,
    callback?: () => void,
  ): Promise<any>;
  getUrl(): Promise<string>;
  close(): Promise<void>;
}
