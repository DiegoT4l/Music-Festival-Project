document.addEventListener('DOMContentLoaded', function () {
    createGallery();
    toggleMenu();
    fixedNav();
    highlightNav();
    scrollNav();
});


function toggleMenu() {
    const burger = document.querySelector('.burger');
    const menuItems = document.querySelector('.principal-nav');
    const menuLinks = document.querySelectorAll('.principal-nav a');

    burger.addEventListener('click', function () {
        menuItems.classList.toggle('active-menu');
    });
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuItems.classList.remove('active-menu');
        });
    });
}

function fixedNav() {
    const header = document.querySelector('.header');
    const video = document.querySelector('.video');

    window.addEventListener('scroll', function () {
        if (video.getBoundingClientRect().bottom <= 0) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
}

function createGallery() {
    const gallery = document.querySelector('.gallery-images');
    const IMAGE_COUNT = 16;

    for (let i = 1; i <= IMAGE_COUNT; i++) {
        const image = document.createElement('PICTURE');
        image.innerHTML = `
            <source srcset="src/img/gallery/thumb/${i}.avif" type="image/avif">
            <source srcset="src/img/gallery/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="src/img/gallery/thumb/${i}.jpg" alt="imagen galeria">
        `;


        image.addEventListener('click', function () {
            openModal(i);
        });

        gallery.appendChild(image);
    }
}

function openModal(imageIndex) {
    const image = document.createElement('PICTURE');
    image.innerHTML = `
        <source srcset="src/img/gallery/full/${imageIndex}.avif" type="image/avif">
        <source srcset="src/img/gallery/full/${imageIndex}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="src/img/gallery/full/${imageIndex}.jpg" alt="imagen galeria">
    `;

    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.addEventListener('click', () => closeModal());

    const closeButton = document.createElement('BUTTON');
    closeButton.textContent = 'X';
    closeButton.classList.add('modal-close');
    closeButton.addEventListener('click', () => closeModal());

    modal.appendChild(image);
    modal.appendChild(closeButton);

    const body = document.querySelector('body');
    body.appendChild(modal);
    body.classList.add('overflow-hidden');
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('fade-out');
    document.querySelector('body').classList.remove('overflow-hidden');
    setTimeout(() => {
        modal?.remove();
    }, 200);
}

function highlightNav() {
    document.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.principal-nav a');

        let actualSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                actualSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${actualSection}`) {
                link.classList.add('active-link');
            }
        });
    });
}

function scrollNav() {
    const links = document.querySelectorAll('.principal-nav a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(e.target.getAttribute('href'));
            section.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}