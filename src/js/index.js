import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './images-service';

const imageApiService = new ImagesApiService();
const form = document.querySelector('form#search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);
// let queriesArray = [];

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notify.info('Please enter your search query!');
    return;
  } else {
    imageApiService
      .getImage()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length < 40) {
          renderImages(queriesArray);
          loadMoreBtn.classList.add('is-hidden');
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          // Notify.info(
          //   "We're sorry, but you've reached the end of search results."
          // );
        } else {
          renderImages(queriesArray);
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          loadMoreBtn.classList.remove('is-hidden');
        }
      })
      .catch(error => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        console.log(error);
      });
  }
}

function onLoadMore() {
  imageApiService.getImage().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
      // gallery.insertAdjacentHTML(
      //   'afterend',
      //   `<p>We're sorry, but you've reached the end of search results.</p>`
      // );
    }
  });
}

function renderImages(queriesArray) {
  const markup = queriesArray
    .map(item => {
      return `<div class="photo-card">
  <div class="thumb"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${item.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${item.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${item.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${item.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
