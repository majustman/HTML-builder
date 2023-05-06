const path = require('path');
const fsPromises = require('fs/promises');

(async function copyDir(pathToDir) {
  await fsPromises.mkdir(path.join(pathToDir, 'files-copy'), {recursive: true});
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'files'), { withFileTypes: true });
    for (const file of files) if (file.isFile()) {
      try {
        await fsPromises.copyFile(path.join(pathToDir, 'files', file.name), path.join(pathToDir, 'files-copy', file.name));
      } catch (err) {
        throw err;
      }
    }
  } catch (err) {
    throw err;
  }
})(__dirname)
