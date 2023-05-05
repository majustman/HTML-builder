const path = require('path');
const fs = require('fs');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdout } = process;
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => console.log('Error', error.message));
