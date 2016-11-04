/* eslint-env node, mocha */
"use strict";

var fs = require('fs');
var Promise = require('bluebird');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;
var path = require('path');

var BlueGate = require('bluegate');
var Needle = Promise.promisifyAll(require('needle'), {multiArgs: true});

describe('BlueGate handlebars', function() {
  var app;
  var url = 'http://localhost:3000';

  before(function() {
    app = new BlueGate({
      log: false
    });
    require('./bluegate-handlebars.js')(app, {
      files: 'test/templates/**/*.hbs'
    });
    return app.listen(3000);
  });

  after(function() {
    return app.close();
  });

  it('can render basic template', function() {
    app.process('GET /basic', function() {
      this.setParameter('template', 'basic');
      return {};
    });
    return Needle.getAsync(url + '/basic').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.contain('text/html');
      expect(response[1].trim()).to.equal('<html>Basic test</html>');
    });
  });

  it('will pass variables to template', function() {
    app.process('GET /variable', function() {
      this.setParameter('template', 'variable');
      return {title: 'This is a test...'};
    });
    return Needle.getAsync(url + '/variable').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.contain('text/html');
      expect(response[1].trim()).to.equal('<title>This is a test...</title>');
    });
  });

  it('will not affect routes not using templates', function() {
    app.process('GET /no-template', function() {
      return {};
    });
    return Needle.getAsync(url + '/no-template').then(function(response) {
      expect(response[0].statusCode).to.equal(200);
      expect(response[0].headers['content-type']).to.not.contain('text/html');
      expect(response[1]).to.deep.equal({});
    });
  });

  it('will raise an error when using an unknown template', function() {
    var error;
    app.process('GET /unknown-template', function() {
      this.setParameter('template', 'unknown');
      return {};
    });
    app.error('GET /unknown-template', function() {
      error = this.error;
    });
    return Needle.getAsync(url + '/unknown-template').then(function(response) {
      expect(response[0].statusCode).to.equal(500);
      expect(error instanceof Error).to.equal(true);
      expect(error.message).to.contain('Unknown template');
    });
  });
});
