const io = require('socket.io-client/dist/socket.io.js');
const actions = require('./actions.js');
const views = require('./views.js');
const uri = '127.0.0.1:8091';
const socket = io(uri);

const app = {
  'div': {
    'btn': document.querySelector('.btnSendMessage'),
    'input': document.querySelector('.inputSendMessage'),
    'youtubeVideo': document.querySelectorAll('.youtubeVideoBtn'),
    'carrefourStore': document.querySelectorAll('.carrefourStore')
  },
  'data': {
    'GET_INPUT_VALUE': () => {
      return app.div.input.value;
    },
    'RESET_INPUT_VALUE': () => {
      app.div.input.value = '';
    }
  },
  'events': {
    'keypress': (event) => {
      if (event.code === 'Enter') {
        app.actions.SEND_MESSAGE(socket, app.data.GET_INPUT_VALUE());
        app.data.RESET_INPUT_VALUE();
      }
    },
    'btnYoutube': (event) => {
      views.YOUTUBE_PLAYER(event.target.dataset.id);
    },
    'btnCarrefourStore': (event) => {
      const item = event.target;
      const data = {
        'name': item.innerHTML.trim(),
        'coords': {
          'start_latitude': item.dataset.startLatitude,
          'start_longitude': item.dataset.startLongitude,
          'end_latitude': item.dataset.endLatitude,
          'end_longitude': item.dataset.endLongitude
        }
      };

      views.CARREFOUR_MAP(data);
    }
  },
  'actions': actions,
  'run': () => {
    app.div.input.addEventListener('keypress', app.events.keypress);
    app.div.youtubeVideo.forEach(el => el.addEventListener('click', app.events.btnYoutube));
    app.div.carrefourStore.forEach(el => el.addEventListener('click', app.events.btnCarrefourStore));
  }
};

socket.on('user::newMessage::me', (params) => {
  views.SET_MESSAGE('right', params);
});

socket.on('user::newMessage::all', (params) => {
  views.SET_MESSAGE('left', params);
});

socket.on('system::welcome', (params) => {
  views.SET_SYSTEM_MESSAGE('right', 'alert-info', params.data);
});

socket.on('system::errorCmd', (params) => {
  views.SET_SYSTEM_MESSAGE('right', 'alert-danger', params.data);
});

socket.on('uber::estimate', (data) => {
  views.UBER_ESTIMATE(data);
});

socket.on('uber::estimateError', (data) => {
  views.SET_SYSTEM_MESSAGE('right', 'alert-danger', data);
});

socket.on('youtube::find', (data) => {
  views.YOUTUBE_FIND(data, () => {
    app.div.youtubeVideo = document.querySelectorAll('.youtubeVideoBtn');
    app.run();
  });
});

socket.on('youtube::findError', (data) => {
  views.SET_SYSTEM_MESSAGE('right', 'alert-danger', data);
});

socket.on('carrefour::askCoords', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(res => {
      const msg = `/carrefour find --longitude ${res.coords.longitude} --latitude ${res.coords.latitude}`;

      app.actions.SEND_MESSAGE(socket, msg);
    });
  } else {
    views.SET_SYSTEM_MESSAGE('left', 'alert-danger', {
      'username': 'Carrefour',
      'message': 'Geolocation is not supported by this browser.'
    });
  }
});

socket.on('carrefour::findError', () => {});

socket.on('carrefour::find', (data) => {
  views.CARREFOUR_LIST(data, () => {
    app.div.carrefourStore = document.querySelectorAll('.carrefourStore');
    app.run();
  });
});

socket.on('twitter::lasttweet', (data) => {
  views.SET_BOT_MESSAGE({
    'bot': {
      'name': 'Twitter'
    },
    'cmd': {
      'text': `${data.name}<br>${data.tweet}`
    }
  });
});

socket.on('twitter::lasttweetError', (data) => {
  views.SET_SYSTEM_MESSAGE('left', 'alert-warning', {
    'username': 'Twitter',
    'message': data
  });
});

app.run();
