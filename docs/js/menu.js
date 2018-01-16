const summary = document.getElementById('book-summary');
const body = document.getElementById('book-body');

document.getElementById('buttonToggleMenu').addEventListener('click', function(event) {
    event.preventDefault();
    if (summary.classList.contains('open')) {
        summary.classList.remove('open');
        summary.setAttribute("aria-hidden", "true");
        body.setAttribute("aria-hidden", "false");
    } else {
        summary.classList.add('open');
        summary.setAttribute("aria-hidden", "false");
        body.setAttribute("aria-hidden", "true");
        summary.getElementsByTagName('a')[0].focus();
    }
});

const links = summary.getElementsByTagName('a');

for (let index = 0; index < links.length; index++) {
    const link = links[index];
    link.addEventListener('click', function () {
        summary.classList.remove('open');
    });
}

