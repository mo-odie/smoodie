import crypto from "node:crypto";

// 클래스, 심볼, 문자열 모두 토큰으로 사용 가능
export type InjectionToken<T = any> = Class<T> | symbol | string;
export type Class<T = any> = {
  new (...args: any[]): T;
  Metadata: Metadata<T>;
};

export interface Metadata<T> {
  construct: (provider: Provider) => T;
}

export const LIFECYCLE = {
  Singleton: "singleton",
  Scoped: "scoped",
  Transient: "transient"
} as const;

export type Lifecycle = typeof LIFECYCLE[keyof typeof LIFECYCLE];

export class Provider {
  private static singletons = new Map<InjectionToken, any>();
  private scoped = new Map<InjectionToken, any>();
  private dependencyStack: InjectionToken[] = [];

  register<T = any>(token: InjectionToken<T>) {
    return new RegisterBuilder<T>(token, this);
  }
  
  resolveSingleton<T>(token: InjectionToken<T>, metadata: Metadata<T>): T {
    this.checkCircularDependency(token);
    this.dependencyStack.push(token);
    try {
      let instance = Provider.singletons.get(token);
      if (!instance) {
        instance = metadata.construct(this);
        Provider.singletons.set(token, instance);
      }
      return instance;
    } finally {
      this.dependencyStack.pop();
    }
  }

  // 스코프
  resolveScoped<T>(token: InjectionToken<T>, metadata: Metadata<T>): T {
    this.checkCircularDependency(token);
    this.dependencyStack.push(token);
    try {
      let instance = this.scoped.get(token);
      if (!instance) {
        instance = metadata.construct(this);
        this.scoped.set(token, instance);
      }
      return instance;
    } finally {
      this.dependencyStack.pop();
    }
  }

  // 트랜지언트
  resolveTransient<T>(token: InjectionToken<T>, metadata: Metadata<T>): T {
    this.checkCircularDependency(token);
    this.dependencyStack.push(token);
    try {
      return metadata.construct(this);
    } finally {
      this.dependencyStack.pop();
    }
  }

  // 인스턴스 직접 등록 (항상 싱글톤처럼 동작)
  asInstance<T>(token: InjectionToken<T>, instance: T): T {
    Provider.singletons.set(token, instance);
    return instance;
  }

  private checkCircularDependency(token: InjectionToken) {
    if (this.dependencyStack.includes(token)) {
      throw new Error("❌ Circular dependency detected");
    }
  }
}

class RegisterBuilder<T> {
  private isClass: boolean;
  constructor(
    private token: InjectionToken<T>,
    private provider: Provider
  ) {
    this.isClass = typeof token === "function" && "Metadata" in token;
  }

  asSingleton(): T {
    if (!this.isClass)
      throw new Error("asSingleton은 클래스 토큰에만 사용할 수 있습니다.");
    const cls = this.token as Class<T>;
    return this.provider.resolveSingleton(cls, cls.Metadata);
  }

  asScoped(): T {
    if (!this.isClass)
      throw new Error("asScoped는 클래스 토큰에만 사용할 수 있습니다.");
    const cls = this.token as Class<T>;
    return this.provider.resolveScoped(cls, cls.Metadata);
  }

  asTransient(): T {
    if (!this.isClass)
      throw new Error("asTransient는 클래스 토큰에만 사용할 수 있습니다.");
    const cls = this.token as Class<T>;
    return this.provider.resolveTransient(cls, cls.Metadata);
  }

  asInstance(instance: T): T {
    // 클래스가 아닌 토큰(심볼/문자열)로만 가능
    if (this.isClass)
      throw new Error("asInstance는 클래스 토큰에 사용할 수 없습니다. 심볼/문자열 토큰을 쓰세요.");
    return this.provider.asInstance(this.token, instance);
  }
}