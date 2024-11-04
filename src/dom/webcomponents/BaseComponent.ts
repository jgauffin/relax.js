import { Behavior } from './Behavior';

export abstract class BaseComponent extends HTMLElement {
    private behaviors: Behavior[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Method to add behaviors
    addBehavior(behavior: Behavior): void {
        this.behaviors.push(behavior);
    }

    connectedCallback(): void {
        this.behaviors.forEach((behavior) => behavior.attach(this));
    }

    disconnectedCallback(): void {
        this.behaviors.forEach((behavior) => behavior.detach(this));
    }
}
