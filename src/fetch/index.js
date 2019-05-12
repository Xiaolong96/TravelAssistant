export async function postData(url, data = {}) {
    try {
        let response = await fetch(url, {
          method: 'POST',
          credentials:'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formatData(data),
        });
        let responseJson = await response.json();
        return responseJson;
      } catch (error) {
        alert(error);
        console.error(error);
      }
}

export async function getData(url, data = {}) {
    try {
        let response = await fetch(url + '?' + formatData(data), {
          method: 'GET',
          credentials:'include'
        });
        let responseJson = await response.json();
        return responseJson;
      } catch (error) {
        alert(error);
        console.error(error);
      }
}
function formatData(obj) {
    if(JSON.stringify(obj) === '{}') {
      return '';
    }
    let res = '';
    let keyArr = Object.keys(obj);
    keyArr.forEach((item) => {
        res = res + encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]) + '&';
    })
    return res.substr(0, res.length - 1);
}