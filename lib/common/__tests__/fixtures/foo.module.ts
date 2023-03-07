import { Module } from '../../types';

export class FooModule implements Module {
  register() {
    return { foo: ['bar'] };
  }
}
