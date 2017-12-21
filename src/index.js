import $ from 'jquery';
import './styles.scss';

getGarageItems();
$(document).ready(function() {
  openGarage();
});

function openGarage() {
  const door = $('#wrapper');
  door.slideUp(400);
}

$('#a-z-button').on('click', sortAZ);

$('#garage-items-container').on('click', '.garage-item-title', hideInfo);
$('#submit-button').on('click', onSubmitButtonClick);
// eslint-disable-next-line
$('#garage-items-container').on('click', '.delete-item-button', onDeleteGarageItemButtonClick)
// eslint-disable-next-line
                            .on('click', '.list-item', onClickListItem)
// eslint-disable-next-line
                            .on('click', '.drop-down-placeholder', placeHolderOnClick);


function placeHolderOnClick() {
  // eslint-disable-next-line
  const sibling = $(this).siblings('.drop-down-hidden').toggleClass('drop-down-visible');
}

function GarageItem(title, body) {
  this.title = title;
  this.body = body;
  this.currentRating = 'Rancid';
}


function onClickListItem() {
  const dropDownPlaceholder = $(this).text();
  // eslint-disable-next-line
  $(this).closest('.drop-down-visible').siblings().children('.rating').text(dropDownPlaceholder);
  // eslint-disable-next-line
  const id = $(this).closest('.drop-down-visible').closest('.garage-item').attr('id');
  // eslint-disable-next-line
  const title = $(this).closest('.garage-item-rating').siblings('.garage-item-title-container').children('.garage-item-title').text();
  // eslint-disable-next-line
  const body = $(this).closest('.garage-item-rating').siblings('.garage-item-body').text();
  // eslint-disable-next-line
  const rating = $(this).closest('.drop-down-visible').siblings().children('.rating').text();
  const item = {
    title,
    body,
    rating
  };
  patchGarageItem(id, item);
  $(this).closest('.drop-down-visible').toggleClass('drop-down-visible');

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

function sortAZ() {
  const list = $('#garage-items-container').children();
  const array = Array.from(list);
  console.log(array);
  // array.sort();

}

function prependGarageItem(item) {
  $('#garage-items-container').prepend(`
    <article class="garage-item" id=${item.id}>
      <section class="garage-item-title-container">
        <h3 class='garage-item-title'><span>Garage Item: </span> ${item.title}</h3>
        <div class="delete-item-button-container">
          <button class="delete-item-button">Delete</button>
        </div>
      </section>
        <p class='garage-item-body'><span>Reason why its still here: </span> ${item.body}</p>
      <section class='garage-item-rating'>
        <div class="drop-down-placeholder">
          <p class='rating'>${item.rating}</p>
          <div class="drop-down-icon-container">
            <img src="" alt="">
          </div>
        </div>
        <div class="drop-down-hidden">
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

function hideInfo() {
  const title = $(this).parent().siblings();
  title.toggleClass('hide-info');
}
