(function() {
    const megaMenuToggles = document.querySelectorAll('.nav-item.dropdown') || [];

    function showMenu(event){
        const dropdown = event.target.querySelector('.dropdown-menu');
        const menuToggle = event.target.querySelector('.dropdown-toggle');

        if(dropdown && menuToggle){
            dropdown.classList.add('show');
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.classList.add('show');
        }
    }

    function hideMenu(event){
        const dropdown = event.target.querySelector('.dropdown-menu');
        const menuToggle = event.target.querySelector('.dropdown-toggle');

        if(dropdown && menuToggle){
            dropdown.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('show');
        }
    }

    megaMenuToggles.forEach((toggle) =>{
        toggle.addEventListener('mouseenter', (event) =>{
            showMenu(event);
        }); 
        toggle.addEventListener('mouseleave', (event) => {
            hideMenu(event);
        });
    }); 
})();