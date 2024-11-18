import 'reflect-metadata';

/* eslint-disable @typescript-eslint/no-explicit-any */
type EventCallback = (...args: any[]) => void;

// Symbol used for marking subscriber methods
const SUBSCRIBER_METADATA_KEY = Symbol('dom-pubsub-subscriber');


interface MessageDefinition {
    topic: string;
    description?: string;
    schema?: any; // JSON schema or validation schema
}

const SignalRegistry = new Map<string, MessageDefinition>();

function validateMessage(payload: any, schema: any): boolean {
    // Basic schema validation (extend with libraries like AJV for JSON schema validation)
    for (const key in schema) {
        if (schema[key].required && !(key in payload)) {
            return false;
        }
    }
    return true;
}

export function Signal(topic: string, description?: string, schema?: any): MethodDecorator {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        // Register the message in the global registry
        SignalRegistry.set(propertyKey.toString(), {
            topic,
            description,
            schema,
        });

        // Keep the original method behavior
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            // Optional: You can validate the arguments against the schema here
            if (schema) {
                const isValid = validateMessage(args[0], schema);
                if (!isValid) {
                    throw new Error(`Invalid message payload for topic: ${topic}`);
                }
            }
            return originalMethod.apply(this, args);
        };
    };
}


// Utility function to find elements with subscriber methods
function findSubscribers(element: HTMLElement): Array<{ element: HTMLElement; method: EventCallback }> {
    const subscribers: Array<{ element: HTMLElement; method: EventCallback }> = [];
    const keys = Reflect.ownKeys(element);

    keys.forEach((key) => {
        const metadata = Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, element, key);
        if (metadata) {
            subscribers.push({
                element,
                method: metadata.method,
            });
        }
    });

    return subscribers;
}

// Decorator for marking subscriber methods
function Subscribe(eventType: string) {
    return function (target: HTMLElement, propertyKey: string | symbol) {
        const metadata = {
            eventType,
            method: target[propertyKey as keyof HTMLElement] as EventCallback,
        };
        Reflect.defineMetadata(SUBSCRIBER_METADATA_KEY, metadata, target, propertyKey);
    };
}

export class PubSub {
    static publishUp(startElement: HTMLElement, message: object) {
        let current: HTMLElement | null = startElement;

        while (current) {
            const subscribers = findSubscribers(current);

            subscribers.forEach(({ method }) => {
                const metadata = Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, current, method.name);
                if (metadata?.eventType === message.constructor.name) {
                    method.apply(current, message);
                }
            });

            current = current.parentElement;
        }
    }

    static publishDown(startElement: HTMLElement, message: object) {
        function traverse(element: HTMLElement) {
            const subscribers = findSubscribers(element);

            subscribers.forEach(({ method }) => {
                const metadata = Reflect.getMetadata(SUBSCRIBER_METADATA_KEY, element, method.name);
                if (metadata?.eventType === message.constructor.name) {
                    method.apply(element, message);
                }
            });

            Array.from(element.children).forEach((child) => {
                if (child instanceof HTMLElement) {
                    traverse(child);
                }
            });
        }

        traverse(startElement);
    }
}

// Example usage
class MyComponent extends HTMLElement {
    constructor() {
        super();
    }

    @Subscribe('exampleEvent')
    onExampleEvent(data: string) {
        console.log(`Event received in ${this.tagName}:`, data);
    }
}

// Register the custom element
customElements.define('my-component', MyComponent);

// Example DOM setup
const root = document.createElement('div');
const parent = new MyComponent();
const child = new MyComponent();

root.appendChild(parent);
parent.appendChild(child);

class MyMessage{constructor(public msg: string){}}
// Publishing an event
PubSub.publishDown(root, new MyMessage('hello down'));
PubSub.publishUp(child, new MyMessage('Hello from publishUp!'));
