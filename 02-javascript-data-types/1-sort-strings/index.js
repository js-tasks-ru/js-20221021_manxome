/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let sortedArr = [...arr].sort(function (a, b) {
        if (param === 'asc') {
            return a.localeCompare(b, 'ru-u-en-kf-upper', {sensitivity: 'variant'});
        } else if (param === 'desc') {
            return b.localeCompare(a, 'ru-u-en-kf-upper', {sensitivity: 'variant'});
        }
    });

    return sortedArr;
}