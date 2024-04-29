// src/collections/LinkedList.ts
var Node = class {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
};
var LinkedList = class {
  constructor() {
    this._length = 0;
  }
  addLast(value) {
    if (!this._first) {
      this._first = new Node(value);
      this._last = this._first;
    } else {
      const newNode = new Node(value);
      this._last.next = newNode;
      this._last = newNode;
    }
    this._length++;
  }
  removeFirst() {
    if (!this.first) {
      throw new Error("The is no first entry.");
    }
    const value = this._first.value;
    this._first = this._first.next;
    this._length--;
    return value;
  }
  get length() {
    return this._length;
  }
  get first() {
    return this._first;
  }
  get firstValue() {
    return this._first?.value;
  }
  get last() {
    return this._last;
  }
  get lastValue() {
    return this._last?.value;
  }
};

// src/http/SimpleWebSocket.ts
var WebSocketClient = class {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.receiveQueue = new LinkedList();
    this.sendQueue = new LinkedList();
    this.isConnected = false;
    this.isSendingQueue = false;
  }
  connect() {
    this.reConnect();
  }
  async send(data) {
    if (!this.isConnected || this.isSendingQueue) {
      console.log("queuing", data);
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
  async receive() {
    if (this.receivePromiseWrapper) {
      throw new Error("You can only invoke receive() once at a time.");
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
  onMessage(ev) {
    let msg;
    if (this.options?.codec) {
      msg = this.options.codec.decode(ev.data);
    } else if (ev.data.length > 0 && (ev.data[0] == '"' || ev.data[0] == "[" || ev.data[0] == "{")) {
      msg = JSON.parse(ev.data);
    } else {
      msg = ev.data;
    }
    console.log("received ", ev.data);
    if (this.receivePromiseWrapper) {
      this.receivePromiseWrapper.resolve(msg);
      this.receivePromiseWrapper = null;
      return;
    }
    this.receiveQueue.addLast(msg);
  }
  reConnect() {
    const ws = new WebSocket(this.url);
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
        setTimeout(() => this.reConnect(), 1e3);
      }
    };
  }
  sendInternal(data) {
    console.log("Sending", data);
    let dataToSend;
    if (typeof data !== "string") {
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
  sendQueueItems() {
    if (this.isSendingQueue) {
      return;
    }
    console.log("Sending queue");
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
};
var PromiseWrapper = class {
};
export {
  WebSocketClient
};
