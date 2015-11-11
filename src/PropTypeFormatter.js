const getTypeName = require("./utils/getTypeName");
const formatters = {};

exports.format = format;
exports.defineFormatter = defineFormatter;

defineFormatter("shape", function(shape) {
  let output = shapeToObject(shape);
  output = JSON.stringify(output).replace(/\"/g, "");
  return `shape(${ output })`;
});

defineFormatter("oneOfType", function(types) {
  const typeNames = types.map(format).join(", ");
  return `oneOfType(${ typeNames })`;
});

defineFormatter("oneOf", function(enumValues) {
  return `oneOf(${ enumValues.join(", ") })`;
});

function defineFormatter(typeName, formatter) {
  formatters[typeName] = formatter;
}

function format(checker) {
  const typeName = getTypeName(checker);
  const formatter = formatters[typeName];

  if (formatter && checker && checker.$meta) {
    return formatter(checker.$meta.args);
  }
  else {
    return typeName;
  }
}

function shapeToObject(obj) {
  let result = {};

  Object.keys(obj).forEach(key => {
    let value = obj[key];

    if (typeof value === "function") {
      result[key] = `<${ getTypeName(value) || "unknown" }>`;
    }
    else if (value && typeof value === "object") {
      result[key] = shapeToObject(value); // <== RECURSION.
    }
  });

  return result;
}