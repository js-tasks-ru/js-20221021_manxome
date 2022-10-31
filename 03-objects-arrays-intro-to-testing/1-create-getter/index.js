/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const keys = path.split('.');
    let i=0;
    return function getValue(obj) {
      return (keys.length === i || !obj) ? obj : getValue(obj[keys[i++]]);
    };
}
