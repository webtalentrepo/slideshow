var pp = 0;
onmessage = function (e) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', e.data[0], true);
	xhr.responseType = "blob";
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
//			console.log(xhr.response);
			pp ++;
			postMessage([xhr.response, e.data[1], pp]);
		}
	};
	xhr.send(null);
};