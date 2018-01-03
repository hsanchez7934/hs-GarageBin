import $ from 'jquery';
import './styles.scss';

getGarageItems();
// $(document).ready(countRating);


$('#garage-button-open').on('click', openGarage);
$('#garage-button-close').on('click', closeGarage);

function openGarage() {
  const door = $('#wrapper');
  door.slideUp(5000);
  countItems();
  countRating();
}

function closeGarage() {
  const door = $('#wrapper');
  door.slideDown(5000);
}

$('#a-z-button').on('click', sortAZ);

function sortAZ() {
  let array = [];
  const list = $('#garage-items-container').children();
  list.each((index, element) => {
    const el = $(element).children('.garage-item-title-container').children('h3.garage-item-title').text();
    // console.log(el);
    array.push(el);
  });

  const sorted = array.sort();
  // console.log(sorted);
  let list2 = $('#garage-items-container').children('.garage-item').children('.garage-item-title-container').children('h3.garage-item-title');
  let idArray = [];
  for (var i = 0; i < list2.length; i++) {
    let text = list2[i].innerText;
    // console.log(text);
    if (text.indexOf(sorted)) {
      let id = $(list2[i]).text();
      console.log(id);
    }
  }
}

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
  const title = $(this).closest('.reason').siblings('.garage-item-title-container').children('.garage-item-title').text();
  console.log(title);
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
  countRating();
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
    .then(response => {
      console.log(response);
      countRating();
      countItems();
    })
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
    .then(response => {
      console.log('deleted');
      countItems();
      countRating();
    })
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
    .then(parsedResponse => {
      parsedResponse.forEach(item => prependGarageItem(item));
      countRating();
      countItems();
    })
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
      countItems();
      countRating();
    })
    // eslint-disable-next-line
    .catch(error => console.log(error));
}



function prependGarageItem(item) {
  $('#garage-items-container').prepend(`
    <article class="garage-item" id=${item.id}>
      <section class="garage-item-title-container">
        <span>Garage Item: </span><h3 class='garage-item-title'>${item.title}</h3>
        <div class="delete-item-button-container">
          <button class="delete-item-button">Delete</button>
        </div>
      </section>
      <div class="reason">
          <span>Reason why its still here: </span><p class='garage-item-body'>${item.body}</p>

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
      </div>
    </article>
  `);
}

function hideInfo() {
  const title = $(this).parent().siblings();
  title.toggleClass('reason-visible');
}

function countItems() {
  const list = $('#garage-items-container').children();
  $('#items-count').text('Garage Items: ' + list.length);
}

function countRating() {
  const list = $('#garage-items-container').children().children('.reason').find('.rating');
  let rancidArr = [];
  let dustyArr = [];
  let sparklingArr = [];
  let text;
  for (let i = 0; i < list.length; i++) {
    text = list[i].innerText;
    if (text === 'Rancid') {
      rancidArr.push(text);
    }
    if (text === 'Dusty') {
      dustyArr.push(text);
    }
    if (text === 'Sparkling') {
      sparklingArr.push(text);
    }
  }
  $('#rancid-count').text('Rancid: ' + rancidArr.length);
  $('#dusty-count').text('Dusty: ' + dustyArr.length);
  $('#sparkling-count').text('Sparkling: ' + sparklingArr.length);
};
