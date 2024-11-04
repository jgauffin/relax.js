/* eslint-disable @typescript-eslint/no-explicit-any */

import { Constructor } from "./Constructor";

/**
 * Distributes data to an element hierarchy as long as they have a "data" property or function.
 * @param Base Class to implement mixin to
 * @returns
 */
export function DataDistributorMixin<TBase extends Constructor<HTMLElement>>(
    Base: TBase
) {
    return class extends Base {
        set data(jsonData: Record<string, any>) {
            const childElements = Array.from(this.shadowRoot?.children);

            childElements.forEach((child) => {
                const name = child.getAttribute('name');
                if (
                    name &&
                    Object.prototype.hasOwnProperty.call(jsonData, name)
                ) {
                    if (typeof (child as any).setData === 'function') {
                        (child as any).setData(jsonData[name]);
                    } else if (typeof (child as any).data === 'function') {
                        (child as any).setData(jsonData[name]);
                    } else {
                        (child as any).data = jsonData[name];
                    }
                }
            });
        }
    };
}

// Example usage: Creating a ParentComponent with the mixin
class BaseParentComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
      <div id="container">
        <slot></slot> <!-- Slot to project child components -->
      </div>
    `;
    }
}

// Apply the mixin to create a new class
const ParentComponent = DataDistributorMixin(BaseParentComponent);
customElements.define('parent-component', ParentComponent);
