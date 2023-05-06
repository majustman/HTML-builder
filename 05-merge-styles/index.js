const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const srcDir = 'styles';
const destDir = 'project-dist';
const extType = '.css';

(async function(src, dst) {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, src), { withFileTypes: true });
    const output = fs.createWriteStream(path.join(__dirname, dst, 'bundle.css'));
    for (const file of files) if (file.isFile() && path.extname(file.name) === extType) {
      const stream = fs.createReadStream(path.join(__dirname, src, file.name), 'utf-8');
      stream.on('data', chunk => output.write(chunk));
    }
  } catch (err) {
    throw err;
  }
})(srcDir, destDir);
