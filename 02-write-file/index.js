const readline = require('readline');
const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi there!\nEnter text: ');
let rl = readline.createInterface(stdin);

rl.on('line', (input) => {
  if (input.trim() === 'exit') rl.close()
  else if (input.trim() === '') stdout.write('Enter text: ')
  else {
    output.write(input.trim() + '\n');
    stdout.write('Enter text: ');
  }
});

process.on('exit', () => stdout.write('Good luck!\n'));
