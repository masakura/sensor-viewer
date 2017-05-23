const {SensorStore, SensorFactory, Sensor} = (() => {
  class SensorStore {
    constructor(storeName) {
      this.storeName = storeName;
    }

    load() {
      const item = localStorage.getItem(this.storeName);
      return item ? JSON.parse(item) : [];
    }

    save(sensors) {
      localStorage.setItem(this.storeName, JSON.stringify(sensors));
    }

    includes(name) {
      return this.load().includes(name);
    }

    add(name) {
      if (!this.includes(name)) {
        const sensors = this.load();
        sensors.push(name);
        this.save(sensors);
      }
    }
  }

  class SensorFactory {
    constructor(milkcocoaUrl) {
      this.milkcocoa = new MilkCocoa(milkcocoaUrl);
    }

    sensor(dataStore) {
      return new Sensor(this.milkcocoa, dataStore);
    }
  }

  class Sensor {
    constructor(milkcocoa, dataStore) {
      this.dataStore = milkcocoa.dataStore(dataStore);
    }

    today() {
      const c = new Date();
      const today = new Date(c.getFullYear(), c.getMonth(), c.getDate());
      return this.load(today);
    }

    load(date) {
      return loadMilkcocoa(this.dataStore, date)
        .then(messages => messages.map(convert).map(filter).reverse())
        .then(data => this.wrap(data, date));
    }

    wrap(data, date) {
      const that = this;

      return Object.assign(data, {
        date,
        reload() {
          return that.load(date);
        },
        next() {
          const next = new Date(date.getTime() + 24 * 60 * 60 * 1000);
          return that.load(next);
        },
        prev() {
          const prev = new Date(date.getTime() - 24 * 60 * 60 * 1000);
          return that.load(prev);
        },
      });
    }
  }

  function loadMilkcocoa(dataStore, date) {
    return new Promise(resolve => {
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const history = dataStore.history();
      history.size(999);
      history.span(start.getTime(), end.getTime());
      history.on('data', resolve);

      history.run();
    });
  }

  function convert(data) {
    return Object.assign({timestamp: new Date(data.timestamp)}, {value: data.value});
  }

  function filter(data) {
    const value = _.chain(data.value)
            .pairs()
            .filter(pair => /temp/.test(pair[0]))
            .object()
            .value();
    return {timestamp: data.timestamp, value};
  }


  return {
    SensorStore,
    SensorFactory,
    Sensor
  };
})();
