export const capitalize = function (value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
}
export const camelize = (str) => {
  let temp = str.replace(/\W+(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
  return temp.charAt(0).toLowerCase() + temp.slice(1);
}

export const getTwoDigits = (index) => {
  return ("0" + index).slice(-2)
}
export default {
  capitalize,
  camelize,
  getTwoDigits
}