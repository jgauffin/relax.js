import {
    SimpleDataEvent,
    WebSocketAbstraction,
    WebSocketClient
} from '../../src/http/SimpleWebSocket';

type DataTypes = string | ArrayBufferView | ArrayBufferLike | Blob;
type WsAction = (sentData: DataTypes) => void;
class WebSocketStub implements WebSocketAbstraction {
    sentData: DataTypes[] = [];
    sendCallback?: WsAction;

    onopen: ((event: Event) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onmessage: ((event: SimpleDataEvent) => void) | null;
    send(data: DataTypes): void {
        this.sentData.push(data);
        if (this.sendCallback) {
            this.sendCallback(data);
        }
    }
    close() {}
}

describe('WebSocketClient', () => {
    test('send and receive a message', async () => {
        const stub = new WebSocketStub();
        stub.sendCallback = () => {
            console.log('sending msg');
            if (stub.onmessage) {
                stub.onmessage({ data: 'reply to Hello world' });
            }
        };

        const sut = new WebSocketClient<string>(() => stub);
        sut.connect();
        stub.onopen!(new CustomEvent('connect'));
        sut.send('Hello world');
        const reply = await sut.receive();

        expect(reply).toBe('reply to Hello world');
    });

    test('enqueue received emssages', async () => {
        const stub = new WebSocketStub();
        const sut = new WebSocketClient<string>(() => stub);
        sut.connect();
        stub.onopen!(new CustomEvent('connect'));

        if (stub.onmessage) {
            stub.onmessage({ data: 'reply to Hello world' });
        }
        const reply = await sut.receive();

        expect(reply).toBe('reply to Hello world');
    });

    test('enqueue when disconnected', async () => {
        const stub = new WebSocketStub();
        stub.sendCallback = () => {
            console.log('sending msg');
            if (stub.onmessage) {
                stub.onmessage({ data: 'reply to Hello world' });
            }
        };

        const sut = new WebSocketClient<string>(() => stub);
        sut.send('Hello world');
        sut.connect();
        stub.onopen!(new CustomEvent('connect'));
        const reply = await sut.receive();

        expect(reply).toBe('reply to Hello world');
    });

    test('reconnect on failure', async () => {
        let invokeCount = 0;
        const stub = new WebSocketStub();
        stub.sendCallback = () => {
            console.log('sending msg');
            if (stub.onmessage) {
                stub.onmessage({ data: 'reply to Hello world' });
            }
        };
        const sut = new WebSocketClient<string>(() => {
            invokeCount++;
            return stub;
        });

        sut.connect();
        stub.onopen!(new CustomEvent('connect'));
        stub.onclose!(new CloseEvent('close'));
        await new Promise((r) => setTimeout(r, 2000));

        expect(invokeCount).toBe(2);
    });
});
