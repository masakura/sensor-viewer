(() => {
  function getSensorName() {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      return hash;
    }

    if (location.hostname !== 'localhost') {
      return location.pathname.replace(/^\//, '');
    }

    return '';
  }

  let sensorName = getSensorName();

  const store = new SensorStore('sensors');
  const sensor = new SensorFactory('readirndedjx.mlkcca.com').sensor(sensorName);
  const drawer = ChartDrawer.fromSelector('#graph-area');
  const itemTemplate = _.template($('#sensor-list-item-template').text());
  let current;

  const router = {
    hide() {
      $('#index').hide();
      $('#sensor').hide();
      $('#add').hide();
    },
    showIndex() {
      this.hide();
      $('#index').show();
    },
    showSensor() {
      this.hide();
      $('#sensor').show();

      sensor.today().then(data => this.update(data));
    },
    update(data) {
      current = data;
      $('#date').text(data.date);
      drawer.draw(data);
    },
    showAdd() {
      this.hide();
      $('#add').show();
    },
    prev() {
      current && current.prev().then(data => this.update(data));
    },
    next() {
      current && current.next().then(data => this.update(data));
    }
  };

  $(document).on('click', '#prev', (ev) => {
    router.prev();
    ev.preventDefault();
  });
  $(document).on('click', '#next', (ev) => {
    router.next();
    ev.preventDefault();
  });

  $(document).on('click', '#add-sensor', () => {
    store.add(sensorName);

    router.showSensor();
  });

  $(document).ready(() => {
    $('.sensor-name').text(sensorName);

    const $lis = store.load()
            .map(name => $(itemTemplate({name})));
    $('#sensor-index').empty().append($lis);

    if (!sensorName) {
      // Show index
      // url: http://localhost/
      router.showIndex();
    } else if(store.includes(sensorName)) {
      // Show sensor data (If sensor added)
      // url: http://localhost/#sensor_name
      router.showSensor();
    } else {
      // Add sensor (If sensor not added)
      // url: http://localhost/#sensor_name
      router.showAdd();
    }
  });

  navigator.serviceWorker.register('/sw.js');
})();
