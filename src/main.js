import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import createGallery from './js/render-functions.js';
import getImagesByQuery from './js/pixabay-api.js';
import { clearGallery } from './js/render-functions.js';
import {
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  loadBtn,
  imgGallery,
  lightbox,
  formLoad,
} from './js/render-functions.js';

const forma = document.querySelector('.form');
const formInput = document.querySelector('input[name="search-text"]');
let page = 1;
let userChoice;

forma.addEventListener('submit', handleSubmit);
hideLoader();

loadBtn.addEventListener('click', onLoadMore);

//loading more img cards
async function onLoadMore() {
  page++;
  loadBtn.disabled = true;
  loadBtn.replaceWith(formLoad);
  showLoader();

  try {
    const data = await getImagesByQuery(userChoice, page);

    imgGallery.insertAdjacentHTML('beforeend', createGallery(data.hits));

    lightbox.refresh();

    if (page * 15 < data.totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.warning({
        title: 'Caution',
        message:
          'We are sorry, but you have reached the end of search results.',
        color: 'yellow',
        position: 'topRight',
      });
    }

    const card = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;

    window.scrollBy({
      left: 0,
      top: card * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    alert(error.message);
  } finally {
    hideLoader();
    formLoad.replaceWith(loadBtn);
    loadBtn.disabled = false;
  }
}
//creating gallery after submit event
function handleSubmit(event) {
  event.preventDefault();
  showLoader();
  clearGallery();
  page = 1;

  userChoice = formInput.value.trim().toLowerCase();

  if (!userChoice) {
    iziToast.warning({
      title: 'Caution',
      message: 'Please select at least one item.',
      color: 'yellow',
      position: 'topRight',
    });
    hideLoader();
    return;
  }

  //сhecking if the array of images contains a tag equal to the user query
  getImagesByQuery(userChoice, page)
    .then(hit => {
      const filteredHits = hit.hits.filter(hit =>
        hit.tags.toLowerCase().split(', ').includes(userChoice)
      );
      //checking if array contains data
      if (filteredHits.length === 0) {
        iziToast.warning({
          title: 'Caution',
          message:
            'Sorry, there are no images matching your search query. Please, try again!',
          color: 'red',
          position: 'topRight',
        });
        return;
      }

      //gallery's visualisation function
      imgGallery.innerHTML = createGallery(filteredHits);
      lightbox.refresh();
      showLoadMoreButton();
    })
    .catch(error =>
      iziToast.warning({
        title: 'Caution',
        message: error.message,
        color: 'red',
        position: 'topRight',
      })
    )
    .finally(() => {
      hideLoader();
    });
}
