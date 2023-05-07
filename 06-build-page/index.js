const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const prjctDst = 'project-dist';

let template = '';

(function createProjectDir() {
  fsPromises.mkdir(path.join(__dirname, prjctDst), {recursive: true});
})();

const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));

(async function createHTML() {
  const input = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  input.on('data', templateHandler);
})();

(async function copyStyles(src, dst) {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, src), { withFileTypes: true });
    const output = fs.createWriteStream(path.join(__dirname, dst, 'style.css'));
    for (const file of files) if (file.isFile() && path.extname(file.name) === '.css') {
      const stream = fs.createReadStream(path.join(__dirname, src, file.name), 'utf-8');
      stream.on('data', chunk => output.write(chunk));
    }
  } catch (err) {
    throw err;
  }
})('styles', 'project-dist');

(async function copyDir(pathToDir, src, dest, folderName) {
  await fsPromises.mkdir(path.join(pathToDir, dest, folderName), {recursive: true});
  try {
    const files = await fsPromises.readdir(path.join(pathToDir, src), { withFileTypes: true });
    for (const file of files) if (file.isFile()) {
      try {
        await fsPromises.copyFile(path.join(pathToDir, src, file.name), path.join(pathToDir, dest, folderName, file.name));
      } catch (err) {
        throw err;
      }
    } else copyDir(pathToDir, path.join(src, file.name), path.join(dest, folderName), file.name);
  } catch (err) {
    throw err;
  }
})(__dirname, 'assets', 'project-dist', 'assets')

async function templateHandler(chunk) {
  const fileNames = [];
  const contents = [];
  chunk
    .split('\n')
    .forEach(item => {
      if (item.trim().slice(0, 2) === '{{' && item.trim().slice(-2) === '}}') {
        if (item.trim().split(' ').length > 1) {
          item.trim().split(' ').forEach(el => {
            if (el.trim().slice(0, 2) === '{{' && el.trim().slice(-2) === '}}') {
              fileNames.push(el.trim().slice(2, -2));
            }
          })
        } else {
          fileNames.push(item.trim().slice(2, -2));
        }
      }
    });

  for (let i = 0; i < fileNames.length; i += 1) {
    let tmp = await getComponentContent(fileNames[i]);
    contents.push(tmp);
  }

  template += chunk
    .split('\n')
    .map(item => {
      if (item.trim().slice(0, 2) === '{{' && item.trim().slice(-2) === '}}') {
        if (item.trim().split(' ').length > 1) {
          return item.trim().split(' ').map(el => {
            if (el.trim().slice(0, 2) === '{{' && el.trim().slice(-2) === '}}') {
              return contents.shift();
            }
          }).join('\n');
        } else {
          return contents.shift();
        }
      } else return item;
    })
    .join('\n');
  output.write(template);
}

async function getComponentContent(name) {
  try {
    const content = await fsPromises.readFile(path.join(__dirname, 'components', `${name}.html`), { encoding: 'utf8' });
    return content;
  } catch (err) {
    console.error(err.message);
  }
}
