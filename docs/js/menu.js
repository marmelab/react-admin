const summary = document.getElementById('book-summary');

document.getElementById('buttonToggleMenu').addEventListener('click', function() {
    if (summary.classList.contains('open')) {
        summary.classList.remove('open');
    } else {
        summary.classList.add('open');
    }
});

const links = summary.getElementsByTagName('a');

for (let index = 0; index < links.length; index++) {
    const link = links[index];
    link.addEventListener('click', function () {
        summary.classList.remove('open');
    });
}

