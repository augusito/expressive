import { Module } from '../../types';

export class BarModule implements Module {
  register() {
    return { bar: 'bat' };
  }
}
