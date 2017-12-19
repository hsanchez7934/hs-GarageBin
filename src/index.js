import $ from 'jquery';
import './styles.scss';

getGarageItems();

function GarageItem(title, body) {
  this.title = title;
  this.body = body;
  this.currentRating = 'Rancid';
}

$('#submit-button').on('click', onSubmitButtonClick);
// eslint-disable-next-line
$('#garage-items-container').on('click', '.delete-item-button', onDeleteGarageItemButtonClick);
$('#garage-items-container').on('click', '.list-item', onClickListItem);

function onClickListItem() {
  const dropDownPlaceholder = $(this).text();
  $(this).closest('.drop-down-container').siblings().children('.rating').text(dropDownPlaceholder);
  const id = $(this).closest('.drop-down-container').closest('.garage-item').attr('id');
  const title = $(this).closest('.garage-item-rating').siblings('.garage-item-title-container').children('.garage-item-title').text();
  const body = $(this).closest('.garage-item-rating').siblings('.garage-item-body').text();
  const rating = $(this).closest('.drop-down-container').siblings().children('.rating').text();
  const item = {
    title,
    body,
    rating
  };
  patchGarageItem(id, item);
}

function patchGarageItem(id, item) {
  const newItem = {
    title: item.title,
    body: item.body,
    rating: item.rating
  };

  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(newItem),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => {
      if (response.status === 204) {
        return response.json();
      }
    })
    // eslint-disable-next-line
    .then(response => console.log(response))
    // eslint-disable-next-line
    .catch(error => console.log(error));
}

function onSubmitButtonClick() {
  const userTitle = $('#title-input').val();
  const userBody = $('#body-input').val();
  const newGarageItem = new GarageItem(userTitle, userBody);
  postNewGarageItem(newGarageItem);
  $('#title-input').val('');
  $('#body-input').val('');
}

function onDeleteGarageItemButtonClick() {
  const id = $(this).closest('.garage-item').attr('id');
  destroyGarageItem(id);
  $(this).closest('.garage-item').remove();
}

function destroyGarageItem(id) {
  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE',
  })
  // eslint-disable-next-line
    .then(response => console.log('deleted'))
    // eslint-disable-next-line
    .catch(error => console.log(error));
}

function getGarageItems() {
  fetch(`/api/v1/items`)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(parsedResponse => parsedResponse.forEach(
      item => prependGarageItem(item))
    )
    // eslint-disable-next-line
    .catch(error => console.log(error));
}

function postNewGarageItem(item) {

  const garageItem = {
    title: item.title,
    body: item.body,
    rating: item.currentRating
  };

  fetch(`/api/v1/items`, {
    method: 'POST',
    body: JSON.stringify(garageItem),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(parsedResponse => {
      prependGarageItem(parsedResponse);
    })
    // eslint-disable-next-line
    .catch(error => console.log(error));
}

function prependGarageItem(item) {
  $('#garage-items-container').prepend(`
    <article class="garage-item" id=${item.id}>
      <section class="garage-item-title-container">
        <h3 class='garage-item-title'>${item.title}</h3>
        <div class="delete-item-button-container">
          <button class="delete-item-button">Delete</button>
        </div>
      </section>
        <p class='garage-item-body'>${item.body}</p>
      <section class='garage-item-rating'>
        <div class="drop-down-placeholder">
          <p class='rating'>${item.rating}</p>
          <div class="drop-down-icon-container">
            <img src="" alt="">
          </div>
        </div>
        <div class="drop-down-container">
          <ul class="drop-down-list">
            <li class="list-item">Rancid</li>
            <li class="list-item">Dusty</li>
            <li class="list-item">Sparkling</li>
          </ul>
        </div>
      </section>
    </article>
  `);
}
