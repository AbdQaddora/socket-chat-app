const modal = document.querySelector('.my-modal');
const modalImage = document.querySelector('#my-moadl-image');
const closeModal = () => {
    modal.classList.remove('show');
}

const changeModalImageSrc = (src) => {
    modalImage.src = src;
}

const showImageInModal = (src) => {
    console.log(src);
    changeModalImageSrc(src);
    openModal();
}

const openModal = () => {
    modal.classList.add('show');
}