export class SyncEvent<T>
{
  private listeners = new Array<(args: T) => Promise<boolean>>();

  public Subscribe(subscriber: (args: T) => Promise<boolean>)
  {
    this.listeners.push(subscriber);
  }

  public async Emit(args: T)
  {
    for (const listener of this.listeners) {
      const r = await listener(args);
      if (r !== false) {
        return true;
      }
    }
    return false;
  }
}
