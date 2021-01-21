export class Sha1 {

    private blockstart: any;
    private W = new Array(80);
    private H0 = 0x67452301;
    private H1 = 0xEFCDAB89;
    private H2 = 0x98BADCFE;
    private H3 = 0x10325476;
    private H4 = 0xC3D2E1F0;
    private A;
    private B;
    private C;
    private D;
    private E;
    private temp;
    public msg;
    private msg_len;
    private word_array;
    /*msg :要传入验证的的 sha1字符串*/
    constructor(msg) {
        this.word_array = new Array();
        this.msg = this.Utf8Encode(msg);
        this.msg_len = this.msg.length;
        for (let i = 0; i < this.msg_len - 3; i += 4) {
            let j = this.msg.charCodeAt(i) << 24 | this.msg.charCodeAt(i + 1) << 16 |
                this.msg.charCodeAt(i + 2) << 8 | this.msg.charCodeAt(i + 3);
            this.word_array.push(j);
        }
        this.initMsg(this.msg_len);
    }
    public initMsg(msg_len) {
        let i;
        switch (msg_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = this.msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = this.msg.charCodeAt(msg_len - 2) << 24 | this.msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = this.msg.charCodeAt(msg_len - 3) << 24 | this.msg.charCodeAt(msg_len - 2) << 16 | this.msg.charCodeAt(msg_len - 1) << 8 | 0x80;
                break;
        }
        this.word_array.push(i);
        while ((this.word_array.length % 16) != 14) this.word_array.push(0);
        this.word_array.push(msg_len >>> 29);
        this.word_array.push((msg_len << 3) & 0x0ffffffff);
        this.getTemp();
    }
    public getTemp() {
        for (this.blockstart = 0; this.blockstart < this.word_array.length; this.blockstart += 16) {
            for (let i = 0; i < 16; i++) this.W[i] = this.word_array[this.blockstart + i];
            for (let i = 16; i <= 79; i++) this.W[i] = this.rotate_left(this.W[i - 3] ^ this.W[i - 8] ^ this.W[i - 14] ^ this.W[i - 16], 1);
            this.A = this.H0;
            this.B = this.H1;
            this.C = this.H2;
            this.D = this.H3;
            this.E = this.H4;
            for (let i = 0; i <= 19; i++) {
                this.temp = (this.rotate_left(this.A, 5) + ((this.B & this.C) | (~this.B & this.D)) + this.E + this.W[i] + 0x5A827999) & 0x0ffffffff;
                this.E = this.D;
                this.D = this.C;
                this.C = this.rotate_left(this.B, 30);
                this.B = this.A;
                this.A = this.temp;
            }
            for (let i = 20; i <= 39; i++) {
                this.temp = (this.rotate_left(this.A, 5) + (this.B ^ this.C ^ this.D) + this.E + this.W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                this.E = this.D;
                this.D = this.C;
                this.C = this.rotate_left(this.B, 30);
                this.B = this.A;
                this.A = this.temp;
            }
            for (let i = 40; i <= 59; i++) {
                this.temp = (this.rotate_left(this.A, 5) + ((this.B & this.C) | (this.B & this.D) | (this.C & this.D)) + this.E + this.W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                this.E = this.D;
                this.D = this.C;
                this.C = this.rotate_left(this.B, 30);
                this.B = this.A;
                this.A = this.temp;
            }
            for (let i = 60; i <= 79; i++) {
                this.temp = (this.rotate_left(this.A, 5) + (this.B ^ this.C ^ this.D) + this.E + this.W[i] + 0xCA62C1D6) & 0x0ffffffff;
                this.E = this.D;
                this.D = this.C;
                this.C = this.rotate_left(this.B, 30);
                this.B = this.A;
                this.A = this.temp;
            }
            this.H0 = (this.H0 + this.A) & 0x0ffffffff;
            this.H1 = (this.H1 + this.B) & 0x0ffffffff;
            this.H2 = (this.H2 + this.C) & 0x0ffffffff;
            this.H3 = (this.H3 + this.D) & 0x0ffffffff;
            this.H4 = (this.H4 + this.E) & 0x0ffffffff;
        }
    }

    /**获取sha1加密字符串*/
    public hex_sha1() {
        let temp = this.cvt_hex(this.H0) + this.cvt_hex(this.H1) + this.cvt_hex(this.H2) + this.cvt_hex(this.H3) + this.cvt_hex(this.H4);
        return temp.toLowerCase();
    }
    private rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    private lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    private cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    private Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };
}

export function Sha1Hash(msg: string): string {
    return new Sha1(msg).hex_sha1();
}
