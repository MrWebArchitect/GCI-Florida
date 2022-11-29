//Import Swiper 
import Swiper, {
    Navigation,
    Pagination
} from 'swiper';

//Use Swiper
Swiper.use([Navigation, Pagination]);

// Initialize Swiper
(function () {
    const swipers = document.querySelectorAll('[data-swiper]');

    //Run forEach loop to load multiple swipers if needed
    swipers.forEach((swiper) => {
       
       let options = swiper.dataset.swiper ? JSON.parse(swiper.dataset.swiper) : {};
        new Swiper(swiper, options);
    });
})();