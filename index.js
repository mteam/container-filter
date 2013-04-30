var Container = require('container'),
    bind = require('bind');

module.exports = Filter;

function Filter(source, criteria) {
  Container.call(this);

  this.source = source;
  this.criteria = criteria;

  source.on('add', bind(this, this.add));
  source.on('remove', bind(this, this.remove));
  source.components.forEach(this.add, this);
}

var proto = Filter.prototype =
  Object.create(Container.prototype);

proto.matches = function(container) {
  return (
    container instanceof Container &&
    this.criteria.every(container.has, container)
  );
};

proto.add = function(component) {
  if (this.matches(component)) {
    Container.prototype.add.call(this, component);
  }
};

proto.remove = function(component) {
  if (this.matches(component)) {
    Container.prototype.remove.call(this, component);
  }
};

proto.all = function() {
  return this.components;
};

proto.single = function() {
  if (this.components.length != 1) {
    throw Error('Expected just one component, got ' + this.components.length + ' instead');
  }

  return this.components[0];
};
