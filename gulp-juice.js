var es = require('event-stream'),
    juice = require('juice').juiceResources;

module.exports = function(options){
  options = options || {};
  return es.map(function(file, fn){
      juice(file.contents.toString(), options, function(err, html){
        if(err) return fn(err);
        file.contents = new Buffer(html);
        fn(null, file);
      });
    });
};
