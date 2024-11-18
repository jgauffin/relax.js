export function Inject(dependencyName: string): PropertyDecorator {
    return function (target: unknown, propertyKey: string | symbol) {
        Object.defineProperty(target, propertyKey, {
            get() {
                let currentElement: HTMLElement | null = <HTMLElement>this;
                while (currentElement) {
                    if (currentElement instanceof DependencyProvider) {
                        const dependency = currentElement.resolve(dependencyName);
                        if (dependency) {
                            return dependency;
                        }
                    }
                    currentElement = currentElement.parentElement;
                }
                throw new Error(`Dependency "${dependencyName}" not found.`);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
