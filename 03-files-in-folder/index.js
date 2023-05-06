const path = require('path');
const fsPromises = require('fs/promises');
const {stat} = require('fs');

(async function(pathToDir) {
  try {
    const files = await fsPromises.readdir(pathToDir, { withFileTypes: true });
    for (const file of files) if (file.isFile()) {
      let blksize;
      stat(path.join(pathToDir, file.name), (err, stats) => {
        console.log(`${file.name.split('.')[0]}`
          + ` - ${path.extname(file.name).slice(1)}`
          + ` - ${Math.trunc((stats.size / 1024) * 1000) / 1000}kb`);
      })
    }
  } catch (err) {
    throw err;
  }
})(path.join(__dirname, 'secret-folder'))
