export class CommerceRuntimeNotSupportedError extends Error {
  constructor(operation: string) {
    super(`NOT IMPLEMENTED: CommerceRuntime.${operation} (Phase 3 supports fetchState only)`);
    this.name = 'CommerceRuntimeNotSupportedError';
  }
}
