import { ConfigAggregator } from '../config-aggregator';
import { BarModule } from './fixtures/bar.module';
import { FooModule } from './fixtures/foo.module';
import { NoopModule } from './fixtures/noop.module';

test('should return an instance of ConfigAggregator', () => {
  const aggregator = new ConfigAggregator();
  expect(aggregator).toBeInstanceOf(ConfigAggregator);
});

test('should merge config when class providers', () => {
  const aggregator = new ConfigAggregator([BarModule, FooModule]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat', foo: ['bar'] });
});

test('should merge config when instance providers', () => {
  const aggregator = new ConfigAggregator([new BarModule(), new FooModule()]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat', foo: ['bar'] });
});

test('should merge config when noop providers', () => {
  const aggregator = new ConfigAggregator([BarModule, NoopModule as any]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat' });
});

test('should merge config when function providers', () => {
  const aggregator = new ConfigAggregator([
    () => {
      return { baz: 'baz' };
    },
  ]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ baz: 'baz' });
});

test('should merge config when mix providers', () => {
  const aggregator = new ConfigAggregator([
    new BarModule(),
    FooModule,
    () => {
      return { baz: 'baz' };
    },
  ]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat', foo: ['bar'], baz: 'baz' });
});

test('should overwrite when object providers', () => {
  const aggregator = new ConfigAggregator([new BarModule(), new BarModule()]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat' });
});

test('should concatenate when array providers', () => {
  const aggregator = new ConfigAggregator([
    new BarModule(),
    new FooModule(),
    new FooModule(),
  ]);
  const config = aggregator.getMergedConfig();
  expect(config).toEqual({ bar: 'bat', foo: ['bar', 'bar'] });
});

test('should throw when invalid provider', () => {
  expect(() => new ConfigAggregator(['invalid-provider' as any])).toThrow();
});
