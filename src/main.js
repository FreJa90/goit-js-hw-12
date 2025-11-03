import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import getImagesByQuery from './js/pixabay-api.js';
import {
  createGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  loadBtn,
  clearGallery,
} from './js/render-functions.js';

const forma = document.querySelector('.form');
const formInput = document.querySelector('input[name="search-text"]');
let page = 1;
let userChoice;

forma.addEventListener('submit', handleSubmit);
loadBtn.addEventListener('click', onLoadMore);

//loading more img cards
async function onLoadMore() {
  page++;
  loadBtn.disabled = true;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(userChoice, page);

    const filteredHits = data.hits;

    createGallery(filteredHits);
    hideLoader();

    if (page * 15 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.warning({
        title: 'Caution',
        message:
          'We are sorry, but you have reached the end of search results.',
        color: 'yellow',
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
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
    iziToast.error({
      title: 'Error',
      message: error.message,
      color: 'red',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadBtn.disabled = false;
  }
}
//creating gallery after submit event
async function handleSubmit(event) {
  event.preventDefault();
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  page = 1;

  userChoice = formInput.value.trim().toLowerCase();

  if (!userChoice) {
    iziToast.warning({
      title: 'Caution',
      message: 'Search field cannot be empty.',
      color: 'yellow',
      position: 'topRight',
    });
    hideLoader();
    return;
  }

  //сhecking if the array of images contains a tag equal to the user query
  try {
    const data = await getImagesByQuery(userChoice, page);

    const userHits = data.hits;

    //checking if array contains data
    if (data.totalHits === 0) {
      hideLoadMoreButton();
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please, try again!',
        color: 'red',
        position: 'topRight',
      });

      return;
    }

    //gallery's visualisation function
    createGallery(userHits);

    if (page * 15 >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.warning({
        title: 'Caution',
        message:
          'We are sorry, but you have reached the end of search results.',
        color: 'yellow',
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
      color: 'red',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}
