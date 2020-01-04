/// on load ///
registerSW = async () => {
    if (!navigator.serviceWorker) {
        return;
    }
    try {
        await navigator.serviceWorker.register('./service-worker.js');
    } catch (e) {
        console.error('service worker is not operational')
    }
}
registerSW();

/// auth ///
const user = { }

/// navigation ///
const showPage = (page) => {
    page = page.replace('#', '');
    const main = document.getElementById('main');
    while (main.firstChild) { main.removeChild(main.firstChild); }
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('main').innerHTML = xhttp.responseText;
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.onreadystatechange = () => {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                }
            };
            script.src = page + '.js';
            document.getElementById('main').appendChild(script);
        } else if (this.status === 404) {
            showPage('404');
        }
    };
    xhttp.open('GET', page + '.html', true);
    xhttp.send();
}
showPage(window.location.hash || 'home');
window.addEventListener('hashchange', () => { showPage(window.location.hash) }, false);

/// get form data ///
const validateData = () => {
	const validities = {};
	for (let i = 0; i < form.elements.length; i++) {
		const field = form.elements[i];
		if (!field.name || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') {
            continue;
        }
		if (field.type === 'select-multiple') {
			for (let n = 0; n < field.options.length; n++) {
				if (!field.options[n].selected) {
                    continue;
                }
				validities[encodeURIComponent(field.name)] = field.options[n].validity;
			}
		} else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			validities[encodeURIComponent(field.name)] = field.value.validity;
		}
	}
	return validities;
}
const getData = (form) => {
	const data = {};
	for (let i = 0; i < form.elements.length; i++) {
		const field = form.elements[i];
		if (!field.name || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') {
            continue;
        }
		if (field.type === 'select-multiple') {
			for (let n = 0; n < field.options.length; n++) {
				if (!field.options[n].selected) {
                    continue;
                }
				data[encodeURIComponent(field.name)] = encodeURIComponent(field.options[n].value);
			}
		} else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
			data[encodeURIComponent(field.name)] = encodeURIComponent(field.value);
		}
	}
	return data;
};