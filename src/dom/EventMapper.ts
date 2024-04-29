import { Selector } from './Selector';

/**
 * Makes it easier to subscribe on events in DOM elements.
 */
export class EventMapper {
    private selector: Selector;

    constructor(scope?: HTMLElement, attributePrefix: string = 'yo') {
        this.selector = new Selector(scope, attributePrefix);
    }

    /**
     * Subscribe on the click event.
     * @param selector String to use in the internal @see Selector.
     * @param listener Event receiver.
     * @param options @see AddEventListenerOptions
     */
    click(
        selector: string,
        listener: (ev: MouseEvent) => unknown,
        options?: AddEventListenerOptions
    ): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(
                `Failed to bind "click" to selector "${selector}", no elements found.`
            );

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', listener, options);
        }
    }

    /**
     * Subscribe on the change event.
     * @param selector String to use in the internal @see Selector.
     * @param listener Event receiver.
     * @param options @see AddEventListenerOptions
     */
    change(
        selector: string,
        listener: (ev: Event) => unknown,
        options?: AddEventListenerOptions
    ): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(
                `Failed to bind "change" to selector "${selector}", no elements found.`
            );
        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('change', listener, options);
        }
    }

    /**
     * Subscribe on the keyUp event.
     * @param selector String to use in the internal @see Selector.
     * @param listener Event receiver.
     * @param options @see AddEventListenerOptions
     */
    keyUp(
        selector: string,
        listener: (ev: KeyboardEvent) => unknown,
        options?: AddEventListenerOptions
    ): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(
                `Failed to bind "keyup" to selector "${selector}", no elements found.`
            );

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('keyup', listener, options);
        }
    }

    /**
     * Subscribe on the keyDown event.
     * @param selector String to use in the internal @see Selector.
     * @param listener Event receiver.
     * @param options @see AddEventListenerOptions
     */
    keyDown(
        selector: string,
        listener: (ev: KeyboardEvent) => unknown,
        options?: AddEventListenerOptions
    ): void {
        const items = this.selector.all(selector);
        if (items.length === 0)
            throw new Error(
                `Failed to bind "keydown" to selector "${selector}", no elements found.`
            );

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('keydown', listener, options);
        }
    }
}
