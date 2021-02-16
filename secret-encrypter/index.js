const fs = require('fs');
const Crypto = require('crypto');
let key = process.env['SECRET_ENCRYPTION_KEY'];
let iv = process.env['SECRET_ENCRYPTION_IV'];
let env = process.env.NODE_ENV || 'Unspecified ENV';
if (!key || !iv) {
    throw new Error('Cannot access SECRET_ENCRYPTION_KEY or SECRET_ENCRYPTION_IV. Please specify both as 32-length strings');
}

let fileBuffer;
if (process.env['CONFIG_FILE'] === 'stagingbeak') {
    console.log('[log] using staging:beak file...');
    fileBuffer = fs.readFileSync('./config.stagingbeak.json').toString();
}else if (env === 'production') {
    console.log('[log] using production file...');
    fileBuffer = fs.readFileSync('./config.production.json').toString();
}else{
    console.log('[log] using development file...');
    fileBuffer = fs.readFileSync('./config.development.json').toString();
}

// borrowed from encryption module
const encrypt = (text, key, iv) => {
    const cipher = Crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([
        encrypted,
        cipher.final()
    ]);
    return encrypted.toString('hex');
}

let encryptedFileData = encrypt(fileBuffer, key, iv);
// try to decrypt
const decrypt = (encryptedString, key, iv) => {
    const decipher = Crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(Buffer.from(encryptedString, 'hex'));
    decrypted = Buffer.concat([
        decrypted,
        decipher.final(),
    ]);
    return decrypted.toString();
}
console.log('[log] starting decryption test...');
let decrypted = decrypt(encryptedFileData, key, iv);
try {
    let result = JSON.parse(decrypted);
    if (!result['mysql']) {
        throw new Error('mysql option not found in config - likely invalid.');
    } 
    // console.log(decrypted);
    // console.log(JSON.parse(decrypt)['mysql']);
}catch(e) {
    throw new Error('Validation failed for decryption of encrypted config buffer: ',e);
}
fs.writeFileSync('./config.out.json', encryptedFileData);
console.log('[log] complete. see config.out.json');