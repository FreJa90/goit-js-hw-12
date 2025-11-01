import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

export const formLoad = document.querySelector('.loader');
export const loadBtn = document.querySelector('.load-more-btn');
export const imgGallery = document.querySelector('.gallery');

export let lightbox = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  captionsData: 'alt',
  overlayOpacity: 0.8,
  captionDelay: 250,
  className: 'lightbox',
});

export default function createGallery(array) {
  return array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
    <a class="gallery-link" href="${largeImageURL}">
    <img class="gallery-image" src="${webformatURL}" alt="${tags}"/>
    </a>
    <div class="card-info">
    <p>Likes <span>${likes}</span></p>
    <p>Views <span>${views}</span></p>
    <p>Comments <span>${comments}</span></p>
    <p>Downloads <span>${downloads}</span></p></div>
    </li>`
    )
    .join(' ');
}

export function clearGallery() {
  imgGallery.innerHTML = '';
}

export function showLoader() {
  formLoad.classList.remove('hidden');
}

export function hideLoader() {
  formLoad.classList.add('hidden');
}

export function showLoadMoreButton() {
  loadBtn.classList.remove('hidden');
}

export function hideLoadMoreButton() {
  loadBtn.classList.add('hidden');
}
