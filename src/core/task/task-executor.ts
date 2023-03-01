const DEFAULT_TEARDOWN = () => process.exit(1);

export class TaskExecutor {
  public static execute(
    callback: () => void,
    teardown: (err: any) => void = DEFAULT_TEARDOWN,
  ) {
    try {
      callback();
    } catch (err) {
      console.error(err);
      teardown(err);
    }
  }
}
