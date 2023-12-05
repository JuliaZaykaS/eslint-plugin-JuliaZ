// проверяем, относительный ли путь
function isPathRelative(path) {
  // проверяем, с чего начинается путь, и если с этих знаков, то путь относительный
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

module.exports = {
    isPathRelative
}