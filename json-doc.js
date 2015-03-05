'use strict';

var
compileTemplate = require('simple-template-js');

var renderRoot = compileTemplate([
  '# <%= ctx.title %>',
  '<%= ctx.description || "" %>',
  '| property | type | description |',
  '|----------|------|-------------|'
].join('\n'), 'path,ctx');

var render = compileTemplate([
  '| <%= path.join(".") %> ',
  '| <%= ctx.enum ? "enum" : ctx.type %> ',
  '| <%= ctx.description %> |'
].join(''), 'path,ctx');

function walk(out, path, ctx) {
  if (path.length === 0) {
    out.push(renderRoot(path, ctx));
  } else {
    out.push(render(path, ctx));
  }

  if (ctx.properties) {
    for (var name in ctx.properties) {
      walk(out, path.concat(name), ctx.properties[name]);
    }
  }
}

function jsonDoc(schema) {
  var out = [];
  walk(out, [], schema);
  return out.join('\n');
}

module.exports = jsonDoc;
