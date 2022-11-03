var fs = require('fs');

DELETE_FOLDERS = ['docs/individuals', 'docs/models', 'docs/releases'];

for (const folder of DELETE_FOLDERS) {
  if (fs.existsSync(folder)) {
    fs.rmSync(folder, { recursive: true }) ;
  }
}
