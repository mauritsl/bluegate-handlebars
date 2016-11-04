BlueGate Handlebars
==================

[![Build Status](https://travis-ci.org/mauritsl/bluegate-handlebars.svg?branch=master)](https://travis-ci.org/mauritsl/bluegate-handlebars)
[![Coverage Status](https://coveralls.io/repos/github/mauritsl/bluegate-handlebars/badge.svg?branch=master)](https://coveralls.io/github/mauritsl/bluegate-handlebars?branch=master)
[![Dependency Status](https://david-dm.org/mauritsl/bluegate-handlebars.svg)](https://david-dm.org/mauritsl/bluegate-handlebars)
[![Known Vulnerabilities](https://snyk.io/test/github/mauritsl/bluegate-handlebars/badge.svg)](https://snyk.io/test/github/mauritsl/bluegate-handlebars)

Render responses with [Handlebars](http://handlebarsjs.com/) templates
in a [BlueGate](https://www.npmjs.com/package/bluegate) application.

## Installation

Install using ``npm install bluegate-handlebars``

## Quick example

Save templates in ``/templates`` folder with a ``.hbs`` extension.

```javascript
var BlueGate = require('bluegate');
var app = new BlueGate();
app.listen(8080);

require('bluegate-handlebars')(app);

app.process('GET /', function() {
  this.setParameter('template', 'homepage');
  return {title: 'Test'};
});
```

Template in ``/templates/homepage.hbs``:
```javascript
<h1>{{title}}</h1>
```

The template name used in the parameter is the filename of the template, without extension.

## Custom options

A ``files`` option can be provided to indicate where the template files can be found.
This pattern is parsed by the [globby](https://www.npmjs.com/package/globby) module.

```javascript
require('bluegate-handlebars')(app, {
  files: 'templates/**/*.hbs'
});
```
