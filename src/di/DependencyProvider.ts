/* eslint-disable @typescript-eslint/no-explicit-any */
class DependencyProvider extends HTMLElement {
    private dependencies = new Map<string, any>();

    provide(name: string, instance: any) {
        this.dependencies.set(name, instance);
    }

    resolve(name: string): any {
        return this.dependencies.get(name);
    }
}

customElements.define('dependency-provider', DependencyProvider);
