type GeneralListener = (message: unknown) => Promise<void>;
const messageMap = new Map<string, Set<GeneralListener>>();

/**
 * Just a type to force a class (newable object).
 */
export type Newable<T> = { new (...args: unknown[]): T };

/**
 * Event receiver.
 */
export type Listener<T> = (message: T) => Promise<void>;

/**
 * Subscription returned from @see subscribe.
 */
export interface Subscription {

    /**
     * Unsubscribe from a subscription.
     */
    unsubscribe();
}

/**
 * Publish a message to all subscribers.
 * @param message Event to publish.
 * @see subscribe
 */
export async function publish(message: unknown): Promise<void> {
    const messageName = message.constructor.name;
    if (!messageName){
        throw new Error("Message is not an object: " + message);
    }

    const listeners = messageMap.get(messageName);
    if (!listeners) {
        return;
    }

    for (const listener of listeners) {
        await listener(message);
    }
}

/**
 * Subscribe to messages.
 * @param messageClass Class to subscribe to (i.e. the class should be passed and not an instance).
 * @param listener Listener that will receive the messages.
 * @returns Subscription, you must invoke `unsubscribe()` when done.
 * @see publish
 */
export function subscribe<T>(messageClass: Newable<T>, listener: Listener<T>): Subscription {
    const messageName = messageClass.name;
    if (!messageName){
        throw new Error("messageClass is not a class: " + messageClass);
    }

    let listeners = messageMap.get(messageName);
    if (!listeners) {
        listeners = new Set();
        messageMap.set(messageName, listeners);
    }

    listeners.add(listener);

    return {
        unsubscribe: function unsubscribe() {
            messageMap.get(messageName).delete(listener);
        }
    };
}
