import swal from 'sweetalert';
export function DB(type, key, data = '') {
   if (type === 'get') {
    if (data) {
      const storedData = JSON.parse(localStorage.getItem(key));
      return storedData ? storedData[data] : null;
    } else {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : null;
    }
  } else if (type === 'set') {
    localStorage.setItem(key, JSON.stringify(data));
  } else if (type === 'remove') {
    localStorage.removeItem(key);
  } else if (type === 'clear') {
    localStorage.clear();
  } else {
    swal({
  title: "error",
  text: "failed stora",
  icon: "error",
});
  }
}
