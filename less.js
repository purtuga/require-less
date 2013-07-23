define('require/less', ['require/css', 'require'], function(css, require) {

  var less = {};

  less.pluginBuilder = './less-builder';

  if (typeof window === 'undefined') {
    less.load = function(n, r, load) {
      load();
    };
    return less;
  }

  //copy api methods from the css plugin
  less.normalize = function(name, normalize) {
    if (name.substr(name.length - 5, 5) == '.less')
      name = name.substr(0, name.length - 5);

    name = normalize(name);

    return name;
  };

  less.parse = function(content, callback) {
    require(['./lessc'], function(lessc) {
      var css;
      var parser = new lessc.Parser();
      parser.parse(content, function(err, tree) {
        if (err)
          throw err;
        try {
          css = tree.toCSS();
        }
        catch(e) {
          throw new Error("LESS parse error: " + e.type + ", " + e.message);
        }
        //instant callback luckily for builds
        callback(css);
      });
    });
  }

  less.load = function(lessId, req, load, config) {
    css.load(lessId, req, load, config, less.parse);
  };

  return less;
});
