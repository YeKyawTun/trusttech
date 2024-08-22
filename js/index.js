/* JavaScript to equalize card-title heights */
document.addEventListener('DOMContentLoaded', function() {
    var cardTitles = document.querySelectorAll('.card-title'); // Select all card titles
    var maxHeight = 0;
    // Find the tallest card title
    cardTitles.forEach(function(cardTitle) {
        if (cardTitle.offsetHeight > maxHeight) {
            maxHeight = cardTitle.offsetHeight;
        }
    });
    // Set all card titles to the height of the tallest card title
    cardTitles.forEach(function(cardTitle) {
        cardTitle.style.height = maxHeight + 'px';
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var closeButton = document.querySelector('.closebtn');
    var navbarCollapse = document.getElementById('navbarNav');

    closeButton.addEventListener('click', function() {
        var bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: true
        });
    });
});


