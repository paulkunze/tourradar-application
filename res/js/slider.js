/* the slider functionality was taken from jquery-ui */
$(function () {
  var durationSlider = $("#duration-slider");
  durationSlider.slider({
    range: true,
    min: 3,
    max: 77,
    values: [3, 77],
    slide: function (event, ui) {
      var minValue = ui.values[0];
      var maxValue = ui.values[1];
      $("#duration-min").text(minValue + ' days');
      $("#duration-max").text(maxValue + ' days');
      removeAllResults();
      applyDurationFilter(minValue, maxValue);
    }
  });
  $("#duration-min").text(durationSlider.slider("values", 0) + ' days');
  $("#duration-max").text(durationSlider.slider("values", 1) + ' days');
});