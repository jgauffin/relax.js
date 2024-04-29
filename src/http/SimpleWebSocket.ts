/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinkedList } from '../collections/LinkedList';

export interface SimpleDataEvent {
    data: string | ArrayBufferLike | Blob | ArrayBufferView;
}

/**
 * Abstraction so that WebSocketClient can be unit tested.
 */
export interface WebSocketAbstraction {
    onopen: ((event: Event) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onmessage: ((event: SimpleDataEvent) => void) | null;
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
    close(): void;
}
export type WebSocketFactory = () => WebSocketAbstraction;

/**
 * A websocket client.
 *
 * This client will manage the connection for you and
 * reconnect when disconnected. It also continously receives
 * messages in the background.
 *
 * All messages that are requested to be sent when the socket is disconnected
 * will be enqueued and sent as soon as the socket is connected again.
 */
export class WebSocketClient<TMessage> {
    private ws: WebSocketAbstraction;
    private receiveQueue = new LinkedList<TMessage>();
    private receivePromiseWrapper?: PromiseWrapper<TMessage>;
    private sendQueue = new LinkedList<TMessage>();
    private isConnected = false;
    private isSendingQueue = false;
    private url?: string;
    private wsFactory?: WebSocketFactory;

    constructor(
        urlOrWebSocketFactory: string | WebSocketFactory,
        private options?: WebSocketOptions<TMessage>
    ) {
        if (typeof urlOrWebSocketFactory === 'string') {
            this.url = urlOrWebSocketFactory;
        } else {
            this.wsFactory = urlOrWebSocketFactory;
        }
    }

    connect() {
        this.reConnect();
    }

    async send(data: TMessage): Promise<void> {
        if (!this.isConnected || this.isSendingQueue) {
            console.log('queuing', data);
            this.sendQueue.addLast(data);
            return;
        }

        if (this.sendQueue.length > 0) {
            this.sendQueueItems();
        }

        this.sendInternal(data);
    }

    /**
     * Receive a new message.
     * @returns
     */
    async receive(): Promise<TMessage> {
        if (this.receivePromiseWrapper) {
            throw new Error('You can only invoke receive() once at a time.');
        }

        if (this.receiveQueue.firstValue) {
            return this.receiveQueue.removeFirst();
        }

        this.receivePromiseWrapper = new PromiseWrapper();
        return new Promise((resolve, reject) => {
            this.receivePromiseWrapper.resolve = resolve;
            this.receivePromiseWrapper.reject = reject;
        });
    }

    private onMessage(ev: MessageEvent) {
        let msg: TMessage;
        if (this.options?.codec) {
            msg = this.options.codec.decode(ev.data);
        } else if (
            ev.data.length > 0 &&
            (ev.data[0] == '"' || ev.data[0] == '[' || ev.data[0] == '{')
        ) {
            msg = JSON.parse(ev.data);
        } else {
            msg = ev.data;
        }

        console.log('received ', ev.data);
        if (this.receivePromiseWrapper) {
            this.receivePromiseWrapper.resolve(msg);
            this.receivePromiseWrapper = null;
            return;
        }

        this.receiveQueue.addLast(msg);
    }

    private reConnect() {
        const ws = this.url ? new WebSocket(this.url) : this.wsFactory();
        this.ws = ws;
        ws.onmessage = (evt) => this.onMessage(evt);
        ws.onerror = () => ws.close();
        ws.onopen = () => {
            this.options?.onConnect?.apply(this, this);
            this.sendQueueItems();
            this.isConnected = true;
        };
        ws.onclose = () => {
            this.isConnected = false;
            if (this.options?.onClose) {
                this.options.onClose(this);
            }

            if (this.options?.autoReconnect !== false) {
                setTimeout(() => this.reConnect(), 1000);
            }
        };
    }

    private sendInternal(data: TMessage) {
        console.log('Sending', data);

        let dataToSend: string | ArrayBufferLike | Blob | ArrayBufferView;
        if (typeof data !== 'string') {
            if (this.options?.codec) {
                dataToSend = this.options.codec.encode(data);
            } else {
                dataToSend = JSON.stringify(data);
            }
        } else {
            dataToSend = data;
        }

        this.ws.send(dataToSend);
    }

    private sendQueueItems(): void {
        if (this.isSendingQueue) {
            return;
        }

        console.log('Sending queue');
        this.isSendingQueue = true;
        while (this.sendQueue.length > 0) {
            const item = this.sendQueue.removeFirst();
            if (item == null) {
                break;
            }

            this.sendInternal(item);
        }

        this.isSendingQueue = false;
    }
}

/**
 * CODEC used for messages.
 */
export interface WebSocketCodec<TMessage> {
    /**
     *
     * @param data
     */
    encode(data: TMessage): string | ArrayBufferLike | Blob | ArrayBufferView;

    /**
     *
     * @param data
     */
    decode(data: string | ArrayBufferLike | Blob | ArrayBufferView): TMessage;
}

/**
 * Configuration options for @see WebSocketClient.
 */
export interface WebSocketOptions<TMessage> {
    /**
     * CODEC to use for inbound and outbound messages (if something else that JSON should be used).
     */
    codec?: WebSocketCodec<TMessage>;

    /**
     * Automatically reconnect when getting disconnected.
     */
    autoReconnect?: boolean;

    /**
     * Callback when the WS is connected.
     *
     * Can for instance be used for authentication messags etc.
     *
     * @param socket Socket
     * @returns
     */
    onConnect?: (socket: WebSocketClient<TMessage>) => void;

    /**
     * Invoked when the connection is claused.
     *
     * Do note that the connection will be automatically reconnected if configured (on per default).
     *
     * @param socket Socket.
     * @returns
     */
    onClose?: (socket: WebSocketClient<TMessage>) => void;
}

class PromiseWrapper<TMessage> {
    resolve: (value: TMessage | PromiseLike<TMessage>) => void;
    reject: (reason?: any) => void;
}
