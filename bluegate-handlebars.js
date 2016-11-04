"use strict";

var Promise = require('bluebird');
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var handlebars = require('handlebars');

var _ = require('lodash');
var globby = require('globby');

module.exports = function(app, options) {
  options = _.defaults(options, {
    files: path.join(process.cwd(), 'templates/**/*.hbs')
  });

  var templates = {};

  // Loop though all files.
  globby.sync(options.files).forEach(file => {
    var name = path.basename(file, '.hbs');
    var template = fs.readFileSync(file).toString();
    templates[name] = handlebars.compile(template);
  });

  // Register postprocess callback to render output.
  app.postprocess(function(template) {
    if (template) {
      if (typeof templates[template] === 'undefined') {
        throw Error('Unknown template: ' + template);
      }
      this.output = templates[template](this.output);
    }
  });
};
