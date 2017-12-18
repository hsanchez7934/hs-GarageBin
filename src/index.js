import $ from 'jquery';
import './styles.scss';

getGarageItems();

function GarageItem(title, body) {
  this.title = title;
  this.body = body;
  this.ratings = ['Rancid', 'Dusty', 'Sparkling'];
  this.index = 0;
  this.currentRating = this.ratings[this.index];
}

$('#submit-button').on('click', onSubmitButtonClick);
$('#garage-items-container').on('click', '.delete-item-button', onDeleteGarageItemButtonClick);

function onSubmitButtonClick() {
  const userTitle = $('#title-input').val();
  const userBody = $('#body-input').val();
  const newGarageItem = new GarageItem(userTitle, userBody);
  postNewGarageItem(newGarageItem);
  $('#title-input').val('');
  $('#body-input').val('');
}

function onDeleteGarageItemButtonClick() {
  console.log(this);
}

function destroyGarageItem(id) {
  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE',
  })
    .then(response => console.log('deleted'))
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
