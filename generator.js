// List all files in a directory in Node.js recursively in a synchronous fashion
var fs = require('fs');
var results = {};
var files = [];
var walkSync = function(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if( file === 'desc.json') {
      var raw = fs.readFileSync(dir + file, 'utf8');
      var algorithm = JSON.parse(raw);
      var firstKey = Object.keys(algorithm)[0];
      var dirs = dir.split('/');
      var category = dirs[1];

      algorithm['name'] = firstKey;
      algorithm['category'] = category;
      algorithm['key'] = dirs[2];

      algorithm['applications'] = algorithm['Applications'];
      algorithm['complexity'] = algorithm['Complexity'];
      algorithm['references'] = algorithm['References'];

      delete algorithm[firstKey];
      delete algorithm['Applications'];
      delete algorithm['Complexity'];
      delete algorithm['References'];

      if(!results[category]) {
        results[category] = [];
      }

      results[category].push(algorithm);
    }
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    } else {
      filelist.push(file);
    }
  });

  return filelist;
};

walkSync('./', files);

fs.writeFileSync(__dirname + '/api.json', JSON.stringify(results));
