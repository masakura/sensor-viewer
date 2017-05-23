const {ChartUtility, ChartDrawer} = (() => {
  class ChartUtility {
    static convert(data) {
      return convertToChart(data);
    }
  }

  class ChartDrawer {
    constructor(context) {
      this.context = context;
    }
    draw(data) {
      const drawData = ChartUtility.convert(data);
      graph(this.context, drawData);
    }

    static fromSelector(selector) {
      const context = document.querySelector('#graph-area').getContext('2d');
      return new ChartDrawer(context);
    }
  }

  function graph(context, data) {
    const chart = graph.chart || (graph.chart = new Chart(context, {
      type: 'line',
      data,
    }));
    Object.assign(chart.data, data);
    chart.update();
  }

  function convertToChart(data) {
    console.log(data.map(d => d.timestamp));
    const labels = data.map(d => moment(d.timestamp).format('HH:mm'));
    const types = getTypes(data);
    const datasets = types.map(type => ({
      label: type,
      data: getTypeData(data, type)
    }));

    return {labels, datasets};
  }

  function getTypes(data) {
    return _.chain(data)
      .map(d => Object.keys(d.value))
      .flatten()
      .uniq()
      .value();
  }

  function getTypeData(data, type) {
    return data.map(d => d.value[type]);
  }

  return {
    ChartUtility,
    ChartDrawer
  };
})();
