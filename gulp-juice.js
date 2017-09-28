var es = require('event-stream'),
    juice = require('juice').juiceFile;

module.exports = function(options){
  options = options || {};
  return es.map(function(file, fn){
      juice(file.path, options, function(err, html){
        if(err) return fn(err);
        file.contents = new Buffer(html);
        fn(null, file);
      });
    });
};
