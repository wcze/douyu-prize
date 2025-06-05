
/**
 * @link https://github.com/qianjiachun/douyu-monitor
 */

export class ExWebSocketUnLogin {
    private timer: number | undefined = undefined;
    roomid: string;
    private ws: WebSocket;

    constructor(
        rid: string,
        callback: (msg: string) => void,
        callbackError: () => void
    ) {
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
            this.roomid = rid;
            this.ws = new WebSocket('wss://danmuproxy.douyu.com:8502');
            this.ws.onopen = () => {
                this.ws.send(webSocketPacket(`type@=loginreq/roomid@=${rid}`));
                this.ws.send(webSocketPacket(`type@=joingroup/rid@=${rid}/gid@=-9999/`));
                this.timer = window.setInterval(() => {
                    this.ws.send(webSocketPacket('type@=mrkl/'));
                }, 40000);
            };
            this.ws.onmessage = (e: MessageEvent) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const arr = String(reader.result).split('\0'); // 分包
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].length > 12) {
                            // 过滤第一条和心跳包
                            callback(arr[i]);
                        }
                    }
                };
                reader.readAsText(e.data);
            };
            this.ws.onclose = () => {
                callbackError();
            };
        } else {
            throw new Error('WebSocket not supported in this environment.');
        }
    }

    close() {
        if (this.timer) clearInterval(this.timer);
        this.ws.close();
    }
}

export function webSocketPacket(str: string): Uint8Array {
    const MSG_TYPE = 689;
    const bytesArr = stringToByte(str);
    const buffer = new Uint8Array(bytesArr.length + 4 + 4 + 2 + 1 + 1 + 1);
    const p_content = new Uint8Array(bytesArr.length); // 消息内容
    for (let i = 0; i < p_content.length; i++) {
        p_content[i] = bytesArr[i];
    }
    const p_length = new Uint32Array([bytesArr.length + 4 + 2 + 1 + 1 + 1]); // 消息长度
    const p_type = new Uint32Array([MSG_TYPE]); // 消息类型

    buffer.set(new Uint8Array(p_length.buffer), 0);
    buffer.set(new Uint8Array(p_length.buffer), 4);
    buffer.set(new Uint8Array(p_type.buffer), 8);
    buffer.set(p_content, 12);

    return buffer;
}

export function stringToByte(str: string): number[] {
    const bytes: number[] = [];
    let c: number;
    for (let i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

export function byteToString(arr: number[] | string): string {
    if (typeof arr === 'string') {
        return arr;
    }
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        const one = arr[i].toString(2);
        const v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
            const bytesLength = v[0].length;
            let store = arr[i].toString(2).slice(7 - bytesLength);
            for (let st = 1; st < bytesLength; st++) {
                store += arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(arr[i]);
        }
    }
    return str;
}

export function hex2bin(e: string): number[] | null {
    if (typeof e === 'string' && e.length % 8 === 0) {
        const r: string[] = [];
        for (let o = 0; o < e.length;) {
            r.push(e.substr(o, 2));
            o += 2;
        }
        const n: number[] = [];
        for (let s = 0; s < r.length;) {
            n.push(parseInt(r.slice(s, s + 4).reverse().join(''), 16));
            s += 4;
        }
        return n;
    }
    return null;
}

export function hex(e: number[]): string {
    if (Array.isArray(e)) {
        const r = '0123456789abcdef'.split('');
        return e.map((val) => {
            let t = '';
            for (let o = 0; o < 4; o++) {
                t += r[(val >> (8 * o + 4)) & 15] + r[(val >> (8 * o)) & 15];
            }
            return t;
        }).join('');
    }
    return '';
}

export default ExWebSocketUnLogin;