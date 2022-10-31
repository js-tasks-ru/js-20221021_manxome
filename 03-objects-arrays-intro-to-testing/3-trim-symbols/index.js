/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0 || !string.length) { return ''; }
    if (!size) { return string; }

    let newStr = string[0];
    let sym = 1;

    for (let i = 1; i < string.length; i++) {
        if (string[i] === string[i - 1]) {
            if (sym < size) {
                newStr += string[i];
            }
            sym++;
        } else {
            sym = 1;
            newStr += string[i];
        }
    }

    return newStr;
}
