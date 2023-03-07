import { Container } from '../container';
import type { IContainer } from '../types';

class Engine {}

class BrokenEngine {
  constructor() {
    throw new Error('Broken Engine');
  }
}

class DashboardSoftware {}

class Dashboard {
  constructor(software: DashboardSoftware) {}
}

class TurboEngine extends Engine {}

class Car {
  constructor(public engine: Engine) {}
}

class CarWithOptionalEngine {
  constructor(public engine?: Engine) {}
}

class CarWithDashboard {
  engine: Engine;
  dashboard: Dashboard;
  constructor(engine: Engine, dashboard: Dashboard) {
    this.engine = engine;
    this.dashboard = dashboard;
  }
}

class SportsCar extends Car {}

test('should return an instance of Container', () => {
  const container = new Container([]);
  expect(container).toBeInstanceOf(Container);
});

test('should instantiate a class without dependencies', () => {
  const container = new Container([{ provide: Engine.name, useClass: Engine }]);
  const engine = container.get(Engine.name);

  expect(engine).toBeInstanceOf(Engine);
});

test('should resolve dependencies based on the constructor', () => {
  const container = new Container([
    { provide: Engine.name, useClass: Engine },
    {
      provide: Car.name,
      useFactory: (container: IContainer) =>
        new Car(container.get(Engine.name)),
    },
  ]);
  const car = container.get<Car>(Car.name);

  expect(car).toBeInstanceOf(Car);
  expect(car.engine).toBeInstanceOf(Engine);
});

test('should cache instances', () => {
  const container = new Container([{ provide: Engine.name, useClass: Engine }]);

  const a1 = container.get(Engine.name);
  const a2 = container.get(Engine.name);

  expect(a1).toBe(a2);
});

test('should provide to a value', () => {
  const container = new Container([
    { provide: Engine.name, useValue: 'fake engine' },
  ]);
  const engine = container.get(Engine.name);

  expect(engine).toEqual('fake engine');
});

test('should provide to a factory', () => {
  function sportsCarFactory(container: IContainer) {
    return new SportsCar(container.get(Engine.name));
  }
  const container = new Container([
    { provide: Engine.name, useClass: Engine },
    { provide: Car.name, useFactory: sportsCarFactory },
  ]);
  const car = container.get<Car>(Car.name);

  expect(car).toBeInstanceOf(SportsCar);
  expect(car.engine).toBeInstanceOf(Engine);
});

test('should supporting provider to null', () => {
  const container = new Container([{ provide: Engine.name, useValue: null }]);
  const engine = container.get(Engine.name);

  expect(engine).toBeNull();
});

test('should provide to an alias', () => {
  const container = new Container([
    { provide: Engine.name, useClass: Engine },
    {
      provide: SportsCar.name,
      useFactory: (container: IContainer) =>
        new SportsCar(container.get(Engine.name)),
    },
    { provide: Car.name, useExisting: SportsCar.name },
  ]);
  const car = container.get(Car.name);
  const sportsCar = container.get(SportsCar.name);

  expect(car).toBeInstanceOf(SportsCar);
  expect(car).toBe(sportsCar);
});

test('should throw when the aliased provider does not exist', () => {
  const container = new Container([{ provide: 'car', useExisting: SportsCar }]);

  expect(() => container.get('car')).toThrow();
});

test('should support overriding factory dependencies', () => {
  const container = new Container([
    { provide: Engine.name, useClass: Engine },
    {
      provide: Car.name,
      useFactory: (container: IContainer) =>
        new SportsCar(container.get(Engine.name)),
    },
  ]);
  const car = container.get<Car>(Car.name);

  expect(car).toBeInstanceOf(SportsCar);
  expect(car.engine).toBeInstanceOf(Engine);
});

test('should support optional dependencies', () => {
  const container = new Container([
    {
      provide: CarWithOptionalEngine.name,
      useFactory: (container: IContainer) =>
        new CarWithOptionalEngine(<any>null),
    },
  ]);
  const car = container.get<CarWithOptionalEngine>(CarWithOptionalEngine.name);

  expect(car.engine).toEqual(null);
});

test('should use the last provider when there are multiple providers for same token', () => {
  const container = new Container([
    { provide: Engine.name, useClass: Engine },
    { provide: Engine.name, useClass: TurboEngine },
  ]);

  expect(container.get(Engine.name)).toBeInstanceOf(TurboEngine);
});

test('should resolve when chain dependencies', () => {
  const container = new Container([
    {
      provide: CarWithDashboard.name,
      useFactory: (container: IContainer) =>
        new CarWithDashboard(
          container.get(Engine.name),
          container.get(Dashboard.name),
        ),
    },
    { provide: Engine.name, useClass: Engine },
    {
      provide: Dashboard.name,
      useFactory: (container: IContainer) =>
        new Dashboard(container.get(DashboardSoftware.name)),
    },
    { provide: DashboardSoftware.name, useClass: DashboardSoftware },
  ]);
  const car = container.get<CarWithDashboard>(CarWithDashboard.name);

  expect(car).toBeInstanceOf(CarWithDashboard);
  expect(car.engine).toBeInstanceOf(Engine);
  expect(car.dashboard).toBeInstanceOf(Dashboard);
});

test('should throw when missing chain dependencies', () => {
  const container = new Container([
    {
      provide: CarWithDashboard.name,
      useFactory: (container: IContainer) =>
        new CarWithDashboard(
          container.get(Engine.name),
          container.get(Dashboard.name),
        ),
    },
    { provide: Engine.name, useClass: Engine },
    {
      provide: Dashboard.name,
      useFactory: (container: IContainer) =>
        new Dashboard(container.get(DashboardSoftware.name)),
    },
    // missing 'DashboardSoftware'
  ]);

  expect(() => container.get(CarWithDashboard.name)).toThrow(
    'No provider for "DashboardSoftware" was found; are you certain you provided it during configuration?',
  );
});

test('should throw when invalid provider definition', () => {
  expect(() => new Container(<any>[<any>'blah'])).toThrow(
    'An invalid provider definition has been detected; only instances of Provider are allowed, got: [blah].',
  );
});

test('should throw when invalid class', () => {
  expect(
    () => new Container([{ provide: Engine.name, useClass: <any>Engine.name }]),
  ).toThrow('Unable to instantiate class (Engine is not constructable).');
});

test('should throw when invalid class type', () => {
  expect(
    () => new Container([{ provide: Car.name, useClass: <any>Car }]),
  ).toThrow(
    'An invalid class, "Car", was provided; expected a defult (no-argument) constructor.',
  );
});

test('should throw when cyclic aliases detetected', () => {
  expect(
    () =>
      new Container([
        { provide: TurboEngine.name, useClass: TurboEngine },
        { provide: Engine.name, useExisting: TurboEngine.name },
        { provide: TurboEngine.name, useExisting: Engine.name },
      ]),
  ).toThrow(
    'A cycle has been detected within the aliases definitions:\n Engine -> TurboEngine -> Engine\n',
  );
});

test('should throw when no provider defined', () => {
  const container = new Container([]);

  expect(() => container.get('NonExisting')).toThrow(
    'Service for "NonExisting" could not be created. Reason: No provider for "NonExisting" was found; are you certain you provided it during configuration?',
  );
});

test('should return true when provider exist', () => {
  const container = new Container([
    { provide: String.name, useValue: 'Hello' },
    { provide: Engine.name, useClass: Engine },
    {
      provide: SportsCar.name,
      useFactory: (container: IContainer) =>
        new SportsCar(container.get(Engine.name)),
    },
    { provide: Car.name, useExisting: SportsCar.name },
  ]);

  expect(container.has(String.name)).toBe(true); // service
  expect(container.has(Engine.name)).toBe(true); // class
  expect(container.has(SportsCar.name)).toBe(true); // factory
  expect(container.has(Car.name)).toBe(true); // alias
});

test('should return false when provider does not exist', () => {
  const container = new Container([]);

  expect(container.has('NonExisting')).toBe(false);
});

test('shoul fail to instantiate when error happens in a constructor', () => {
  try {
    new Container([{ provide: Engine.name, useClass: BrokenEngine }]);
  } catch (error: any) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error.message).toContain('Broken Engine');
  }
});

test('should add a single value provider', () => {
  const container = new Container([]);
  container.addProvider({ provide: String.name, useValue: 'Hello' });

  expect(container.get(String.name)).toEqual('Hello');
});

test('should add a single class provider', () => {
  const container = new Container([]);
  container.addProvider({ provide: Engine.name, useClass: TurboEngine });
  const engine: Engine = container.get(Engine.name);

  expect(engine instanceof TurboEngine).toBe(true);
});

test('should add a single factory provider', () => {
  const container = new Container([]);
  container.addProvider({
    provide: Engine.name,
    useClass: Engine,
  });
  container.addProvider({
    provide: Car.name,
    useFactory: (container: IContainer) =>
      new SportsCar(container.get(Engine.name)),
  });
  const car: Car = container.get(Car.name);

  expect(car instanceof SportsCar).toBe(true);
});

test('should add a single alias provider', () => {
  const container = new Container([]);
  container.addProvider({
    provide: TurboEngine.name,
    useClass: TurboEngine,
  });
  container.addProvider({
    provide: Engine.name,
    useExisting: TurboEngine.name,
  });

  expect(container.get(Engine.name)).toBe(container.get(TurboEngine.name));
});

test('should throw when given invalid single provider', () => {
  expect(() => new Container([]).addProvider(<any>'blah')).toThrow(
    'An invalid provider definition has been detected; only instances of Provider are allowed, got: [blah].',
  );
});

test('should throw when single provider cyclic aliases detetected', () => {
  try {
    const container = new Container([]);
    container.addProvider({
      provide: TurboEngine.name,
      useClass: TurboEngine,
    });
    container.addProvider({
      provide: TurboEngine.name,
      useExisting: Engine.name,
    });
  } catch (error: any) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(error.message).toBe(
      'A cycle has been detected within the aliases definitions:\n Engine -> TurboEngine -> Engine\n',
    );
  }
});
