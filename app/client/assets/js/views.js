const googleMaps = require('./googleMaps');

const views = {
  'GET_TEMPLATE_MESSAGE': (dir) => {
    dir = dir === 'left' ? '#template-message-left' : '#template-message-right';
    const tpl = document.querySelector(dir).content.firstElementChild.cloneNode(true);

    return tpl;
  },
  'GET_TEMPLATE_SYSTEM': (dir) => {
    dir = dir === 'left' ? '#template-system-right' : '#template-system-right';
    const tpl = document.querySelector(dir).content.firstElementChild.cloneNode(true);

    return tpl;
  },
  'SET_SYSTEM_MESSAGE': (dir, classType, data) => {
    const tpl = views.GET_TEMPLATE_SYSTEM(dir);

    tpl.querySelector('.labelUserName').innerHTML = '@' + data.username;
    tpl.querySelector('.alert').classList.add(classType);
    tpl.querySelector('.alert').innerHTML = data.message;
    document.querySelector('.chat-content').prepend(tpl);
  },
  'SET_MESSAGE': (dir, data) => {
    const tpl = views.GET_TEMPLATE_MESSAGE(dir);

    tpl.querySelector('.labelUserName').innerHTML = '@' + data.username;
    tpl.querySelector('.card-text').innerHTML = data.message;
    document.querySelector('.chat-content').prepend(tpl);
  },
  'SET_BOT_MESSAGE': (data) => {
    const tpl = views.GET_TEMPLATE_MESSAGE('left');

    tpl.querySelector('.labelUserName').innerHTML = '@' + data.bot.name;
    tpl.querySelector('.card-text').innerHTML = data.cmd.text;
    document.querySelector('.chat-content').prepend(tpl);
  },
  'UBER_ESTIMATE': (data) => {
    const tpl = document.querySelector('#template-uber-right').content.firstElementChild.cloneNode(true);

    tpl.querySelector('.labelUserName').innerHTML = '@Uber';
    tpl.querySelector('.card-text').innerHTML = `
      Distance : ${data.params.distance} KM<br />
      Duration : ${data.params.duration}<br />
      Price : ${data.params.price} $<br />
    `;
    googleMaps.initMap(tpl.querySelector('.contentMap'), data.params.coords);
    document.querySelector('.chat-content').prepend(tpl);
  },
  'YOUTUBE_FIND': (data, callback) => {
    const tpl = views.GET_TEMPLATE_MESSAGE('right');

    tpl.querySelector('.labelUserName').innerHTML = '@' + data.username;

    let dataHTML = `Total result : ${data.videos.length}<br />`;

    for (let video of data.videos) {
      dataHTML += `<button class="youtubeVideoBtn" data-id="${video.id}">${video.title}</button>`;
    }
    tpl.querySelector('.card-text').innerHTML = dataHTML;
    document.querySelector('.chat-content').prepend(tpl);
    callback();
  },
  'YOUTUBE_PLAYER': (id) => {
    const tpl = document.querySelector('#template-youtubePlayer-right').content.firstElementChild.cloneNode(true);
    const uri = `http://www.youtube.com/embed/${id}`;

    tpl.querySelector('#playerYoutube').src = uri;
    document.querySelector('.chat-content').prepend(tpl);
  },
  'CARREFOUR_LIST': (data, callback) => {
    const dir = '#template-message-right';
    const tpl = document.querySelector(dir).content.firstElementChild.cloneNode(true);

    tpl.querySelector('.labelUserName').innerHTML = '@Carrefour';

    let dataHTML = `Total result : ${data.found}<br />`;

    for (let store of data.list) {
      dataHTML += `<button class="carrefourStore" 
        data-start-latitude="${data.start_latitude}"
        data-start-longitude="${data.start_longitude}"
        data-end-longitude="${store.longitude}" 
        data-end-latitude="${store.latitude}">
          ${store.banner} - ${store.address}
        </button>`;
    }
    tpl.querySelector('.card-text').innerHTML = dataHTML;
    document.querySelector('.chat-content').prepend(tpl);
    callback();
  },
  'CARREFOUR_MAP': (data) => {
    const tpl = document.querySelector('#template-uber-right').content.firstElementChild.cloneNode(true);

    tpl.querySelector('.labelUserName').innerHTML = '@Carrefour';
    tpl.querySelector('.card-text').innerHTML = data.name;
    googleMaps.initMap(tpl.querySelector('.contentMap'), data.coords);
    document.querySelector('.chat-content').prepend(tpl);
  }
};

module.exports = views;

