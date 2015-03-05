'use strict';

var
compile = require('simple-template-js');

var
defaultTemplate = [
  '<% if (path.length === 0) { %>',
  '# <%= prop.title %>\n',
  '<%= prop.description || "" %>\n',
  '| property | type | description |\n',
  '|----------|------|-------------|\n',
  '<% } else { %>',
  '| <%= path.join(".") %> | <%= prop.enum ? "enum" : prop.type %> | <%= prop.description %> |\n',
  '<% } %>'
].join('');

function walk(out, path, prop, render) {
  out.push(render(path, prop));
  if (prop.properties) {
    for (var name in prop.properties) {
      walk(out, path.concat(name), prop.properties[name], render);
    }
  }
}

function jsonDoc(schema, template) {
  var out = [], render = compile(template || defaultTemplate, 'path,prop');
  walk(out, [], schema, render);
  return out.join('');
}

module.exports = jsonDoc;
