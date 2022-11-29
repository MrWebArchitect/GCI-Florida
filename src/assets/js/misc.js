(function(){
    //Add a body class once page has loaded
    //Used to add CSS transition elements
    //Avoids content shifting during page load

    window.addEventListener('load', function(){
     document.body.classList.add('page-loaded');
    });
})();