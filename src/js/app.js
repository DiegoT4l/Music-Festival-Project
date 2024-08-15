document.addEventListener('DOMContentLoaded', function() {
    createGallery();
});

function createGallery() {
    const gallery = document.querySelector('.gallery-images');
    const IMAGE_COUNT = 16;

    for (let i = 1; i <= IMAGE_COUNT; i++) {
        const image = document.createElement('IMG');
        image.src = `src/img/gallery/full/${i}.jpg`;
        image.alt = `Thumbnail ${i}`;
        image.classList.add('gallery-image');

        image.addEventListener('click', function() {
            openModal(i);
        });

        gallery.appendChild(image);
    }
}

function openModal(imageIndex) {
    const image = document.createElement('IMG');
    image.src = `src/img/gallery/full/${imageIndex}.jpg`;
    image.alt = `Image ${imageIndex}`;
    image.classList.add('modal-image');

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