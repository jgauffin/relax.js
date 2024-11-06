type Constructor<T = unknown> = new (...args: never[]) => T;

type Mixin<T extends Constructor> = (base: T) => T;

function applyMixins<T extends new (...args: unknown[]) => unknown>(
    BaseClass: T,
    mixins: Mixin<T>[]
  ): T {
    return mixins.reduce((accumulator, mixin) => mixin(accumulator), BaseClass);
  }

  export interface AutoRegisterOptions extends ElementDefinitionOptions{
mixins: Mixin<typeof HTMLElement>[]
  }

export function AutoRegister(tagName: string, options?: AutoRegisterOptions) {
    return function (constructor: CustomElementConstructor) {
      if (customElements.get(tagName)) {
        return;
      }

      const MixedClass = options?.mixins.length > 0 ? applyMixins(constructor, options!.mixins) : constructor;

      customElements.define(tagName, MixedClass as CustomElementConstructor, options);
    };
  }