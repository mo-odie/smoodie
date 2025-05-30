import crypto from "node:crypto";

export const LIFECYCLE = {
  Singleton: "singleton",
  Scoped: "scoped",
  Transient: "transient"
} as const;

export type Lifecycle = typeof LIFECYCLE[keyof typeof LIFECYCLE];

// biome-ignore lint: <어떤 프로퍼티를 가지고 있는 Class 가 들어올 지 알 수 없으므로>
export type Class<T = any> = {
  // biome-ignore lint: <어떤 프로퍼티를 가지고 있는 Class 가 들어올 지 알 수 없으므로>
  new (...args: any[]): T;
  name: string;
  Metadata: Metadata<T>;
};

export interface Metadata<T> {
  construct: (provider: Provider) => T;
  key?: string;
}


class Provider {
    // biome-ignore lint: <어떤 프로퍼티를 가지고 있는 Class 가 들어올 지 알 수 없으므로>
    static singletons = new Map<string, any>();

    static get<T>(key: string): T | undefined {
      return Provider.singletons.get(key);
    }
  
    static register<T>(key: string, instance: T): void {
      Provider.singletons.set(key, instance);
    }
  
    static ensureKey<T>(metadata: Metadata<T>, name: string): string {
      if (!metadata.key) {
        metadata.key = `${name}@${crypto.randomUUID()}`;
        console.log(metadata.key);
        Object.freeze(metadata);
      }
      return metadata.key;
    }

  // biome-ignore lint: <어떤 프로퍼티를 가지고 있는 Class 가 들어올 지 알 수 없으므로>
  private scoped = new Map<string, any>();
  private dependencyStack: { metadata: Metadata<unknown>; resolution: Lifecycle }[] = [];

  private get hasSingletonInDependencyStack(): boolean {
    return this.dependencyStack.some(entry => entry.resolution === LIFECYCLE.Singleton);
  }

  register<T>(targetClass: Class<T>) {
    return new RegisterBuilder(targetClass, this);
  }

  get<T>(key: string): T | undefined {
    return this.scoped.get(key);
  }

  registerInstance<T>(key: string, instance: T): void {
    this.scoped.set(key, instance);
  }

  private checkCircularDependency<T>(metadata: Metadata<T>) {
    if (this.dependencyStack.some(entry => entry.metadata.key === metadata.key)) {
      throw new Error("❌ Circular dependency detected");
    }
  }

  resolveSingleton<T>({metadata, name}: {metadata: Metadata<T>, name: string}): T {
    this.checkCircularDependency(metadata);
    this.dependencyStack.push({ metadata, resolution: LIFECYCLE.Singleton });
    try {
      const key = Provider.ensureKey(metadata, name);
      let instance = Provider.get<T>(key);
      if (!instance) {
        instance = metadata.construct(this);
        Provider.register(key, instance);
      }
      return instance;
    } finally {
      this.dependencyStack.pop();
    }
  }

  resolveScoped<T>({ metadata, name } : { metadata: Metadata<T>, name: string }): T {
    this.checkCircularDependency(metadata);
    this.dependencyStack.push({ metadata, resolution: LIFECYCLE.Scoped });
    try {
      if (this.hasSingletonInDependencyStack) {
        throw new Error(
          `❌ Invalid DI: singleton cannot depend on scoped (${metadata.key ?? "unknown"})`
        );
      }
      const key = Provider.ensureKey(metadata, name);
      let instance = this.get<T>(key);
      if (!instance) {
        instance = metadata.construct(this);
        this.registerInstance(key, instance);
      }
      return instance;
    } finally {
      this.dependencyStack.pop();
    }
  }

  resolveTransient<T>({metadata}: {metadata: Metadata<T>}): T {
    this.checkCircularDependency(metadata);
    this.dependencyStack.push({ metadata, resolution: LIFECYCLE.Transient });
    try {
      return metadata.construct(this);
    } finally {
      this.dependencyStack.pop();
    }
  }
}

class RegisterBuilder<T> {
  constructor(private targetClass: Class<T>, private provider: Provider) {
  }

  asSingleton(): T {
    return this.provider.resolveSingleton({ metadata: this.targetClass.Metadata, name: this.targetClass.name });
  }

  asScoped(): T {
    return this.provider.resolveScoped({ metadata: this.targetClass.Metadata, name: this.targetClass.name });
  }

  asTransient(): T {
    return this.provider.resolveTransient({ metadata: this.targetClass.Metadata });
  }
}

class RegisterInstanceBuilder<T> {
  constructor(private targetClass: Class<T>, private provider: Provider) {
  }

  asScoped(): T {
    return this.provider.resolveScoped({ metadata: this.targetClass.Metadata, name: this.targetClass.name });
  }

  asSingleton(): T {
    return this.provider.resolveSingleton({ metadata: this.targetClass.Metadata, name: this.targetClass.name });
  }
}

export { Provider };
