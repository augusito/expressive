export class HelloService {
  async greeting(): Promise<string> {
    return Promise.resolve('Hello world!');
  }
}
