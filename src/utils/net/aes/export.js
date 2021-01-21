let CryptoJS = require('./aes.js');
//let ecbMode = require('./mode-ecb.js');
/**
 * 加密字符串的函数
 */
function aes_encrypt(text, key, iv) {
    var aes_key = CryptoJS.enc.Utf8.parse(key); //获取aes加密的密钥
    var aes_iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(text),
        aes_key, {
        iv: aes_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString().toUpperCase();
    encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted));
    return encrypted;
}

/**
 * 解密字符串的函数
 */
function aes_decrypt(text, key, iv) {
    var aes_key = CryptoJS.enc.Utf8.parse(key); //获取aes加密的密钥
    var aes_iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(
        CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(text)),
        aes_key, {
        iv: aes_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8).toString();
    return decrypted;
}

/**
 * 解密结果处理，将json转为js对象
 */
function json_parse(decrypted) {
    decrypted = decrypted.replace(decrypted.split("}")[decrypted.split("}").length - 1], "");
    //decrypted = decrypted.replace(/\ +/g, "");
    decrypted = decrypted.replace(/[\r\n]/g, "");
    decrypted = decrypted.replace(/\ufeff/g, "");
    if (!decrypted.replace(" ", "")) decrypted = "{}";
    return JSON.parse(decrypted);
}

module.exports = {
    encrypt: aes_encrypt,
    decrypt: aes_decrypt,
    json_parse: json_parse
}