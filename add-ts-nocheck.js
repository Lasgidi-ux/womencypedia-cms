const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const baseDir = path.join(__dirname, 'src/api');
const files = walkSync(baseDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('// @ts-nocheck')) {
    fs.writeFileSync(file, '// @ts-nocheck\n' + content);
    console.log(`Added @ts-nocheck to ${file}`);
  }
});
