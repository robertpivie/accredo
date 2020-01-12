const OۆO = {};

/// on load ///
OۆO.registerSW = async () => {
    if (!navigator.serviceWorker) {
        return;
    }
    try {
        await navigator.serviceWorker.register('./service-worker.js');
    } catch (e) {
        console.error('service worker is not operational')
    }
}
OۆO.registerSW();

/// common ///
OۆO.setTemplate = (template, target, replacements, callback) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = xhttp.responseText;
            if (replacements) {  
                Object.keys(replacements).forEach(key => {
                    response = response.replace(key, replacements[key]);
                });
            }
            document.getElementById(target).innerHTML = template === 'main' ? response : document.getElementById(target).innerHTML + response;
            if (callback) {
                callback();
            }
        } else if (this.status === 404) {
            showPage('404');
        }
    };
    xhttp.open('GET', template + '.html', true);
    xhttp.send();
};

/// dark mode ///
OۆO.setDarkMode = (on) => {
    if (on) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

/// auth ///
OۆO.user = { }

/// navigation ///
OۆO.showPage = (page) => {
    page = page.replace('#', '');
    const main = document.getElementById('main');
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
    OۆO.setTemplate(page, 'main', null, () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onreadystatechange = () => {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
            }
        };
        script.src = page + '.js';
        document.getElementById('main').appendChild(script);
    });
}
OۆO.showPage(window.location.hash || 'home');
window.addEventListener('hashchange', () => { OۆO.showPage(window.location.hash) }, false);

/// get form data ///
OۆO.validateData = () => {
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
OۆO.getData = (form) => {
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

/// slider ///
OۆO.slide;
OۆO.slides = {};
OۆO.addSlides = (newSlides, target) => {
    Object.keys(newSlides).forEach(key => {
        const value = newSlides[key];
        const replacements = { '${k}':key, '${v}':value };
        OۆO.setTemplate(
            'components/slide',
            target,
            replacements,
            () => {
                OۆO.slides[key] = value;
                OۆO.cycleSlides();
            });
    });    
};
OۆO.clearSlides = (oldSlides) => {
    Object.keys(oldSlides).forEach(key => {
        delete OۆO.slides[key];
    });
};
OۆO.cycleSlides = () => {
    if (typeof slidesTimeout !== 'undefined') {
        clearTimeout(slidesTimeout);
    }
    let next = false;
    const keys = Object.keys(OۆO.slides);
    const min = 0;
    const max = keys.length;
    if (max > 0) {
        const target = Math.floor(Math.random() * (max - min)) + min;
        for (let i=0; i<max; i++) {
            const key = keys[i];
            const slideHTML = document.getElementById(key);
            if (!slideHTML) {
                delete OۆO.slides[key];
                continue;
            }
            if (i === target) {
                slideHTML.classList.remove('hidden');
            } else {
                slideHTML.classList.add('hidden');
            }
        }
    }
    slidesTimeout = setTimeout(() => { OۆO.cycleSlides(); }, 5000);
};
OۆO.cycleSlides();