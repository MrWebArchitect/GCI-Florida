(function () {
    //Add a body class once page has loaded
    //Used to add CSS transition elements
    //Avoids content shifting during page load

    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');

        // Auto-update copyright year
        var yearElement = this.document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    });
})();