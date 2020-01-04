home = () => {
    let showing = ['#dont', '#do'];
    const addSlides = (arr) => {
        for (let n of arr) {
            if (showing.includes(n)) {
                continue;
            }
            showing.push(n);
        }
    }
    const cycleSlides = () => {
        if (typeof slidesTimeout !== 'undefined') {
            clearTimeout(slidesTimeout);
        }
        let pre = showing.shift();
        if (typeof pre === 'undefined') {
            return slidesTimeout = setTimeout(() => { cycleSlides(); }, 5000);
        }
        showing.push(pre);
        for (let i=0; i<showing.length; i++) {
            const id = showing[i];
            const slide = document.querySelector(id);
            if (!slide) {
                showing.splice(i, 1);
                i--;
                continue;
            }
            if (i === 0) {
                slide.classList.remove('hidden');
            } else {
                slide.classList.add('hidden');
            }
        }
        slidesTimeout = setTimeout(() => { cycleSlides(); }, 5000);
    };
    cycleSlides();
};
home();