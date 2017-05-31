var tourdata, filteredTours;
var itemTemplate = $('#item');
var sortingMethod = 'price';
$("#item").remove();

$.getJSON("res/json/tours.json")
  .done(function (data) {
    tourdata = data;
    filteredTours = data;
    attachBestPriceAndDiscount();
    fillPageWithData(tourdata);
    applyPriceSorting();
  })
  .fail(function () {
    $("#items").append('<h2 class="text-align-center">JSON file could not be loaded!</h2>');
  });

function applyDurationFilter(minDays, maxDays) {
  filteredTours = [];
  for (var i = 0; i < tourdata.length; i++) {
    var tourDuration = tourdata[i].length;
    if (tourDuration >= minDays && tourDuration <= maxDays) {
      filteredTours.push(tourdata[i]);
    }
  }
  applySorting();
}

function applyPriceSorting() {
  sortingMethod = 'price';
  applySorting(true);
}

function applyPrioritySorting() {
  sortingMethod = 'priority';
  applySorting(false);
}

function applySorting() {
  if (filteredTours.length === 0) {
    return;
  }
  var tours = jQuery.extend(true, [], filteredTours);    // deep copy
  var sortedTours = [tours[0]];   // start element
  tours.shift();  // remove first element which is already taken
  for (var i = 0; i < tours.length; i++) {
    for (var j = 0; j < sortedTours.length; j++) {
      if ((sortingMethod === 'price') && tours[i].bestPrice <= sortedTours[j].bestPrice // if cheaper: add here
        || (sortingMethod === 'priority') && tours[i].rating >= sortedTours[j].rating) { // if better rated: add here
        sortedTours.splice(j, 0, tours[i]);
        break;
      } else if (j === sortedTours.length - 1) {  // if bigger/ smaller than everything else -> to the end
        sortedTours.push(tours[i]);
        break;
      }
    }
  }
  filteredTours = jQuery.extend(true, [], sortedTours);    // deep copy
  removeAllResults();
  fillPageWithData(filteredTours);
}

function removeAllResults() {
  while (true) {
    var item = $('#item');
    if (item.length !== 0) {
      item.remove();
    } else {
      break;
    }
  }
}

function attachBestPriceAndDiscount() {
  for (var i = 0; i < tourdata.length; i++) {
    var tour = tourdata[i];
    var dates = tour.dates;
    var bestPrice, bestPriceDiscount;
    for (var j = 0; j < dates.length; j++) {
      if (bestPrice === undefined || bestPrice > dates[j].usd) {
        bestPrice = dates[j].usd;
        if (dates[j].discount !== undefined) {
          bestPriceDiscount = dates[j].discount;
        }
      }
    }
    tourdata[i].bestPrice = bestPrice;
    tourdata[i].bestPriceDiscount = bestPriceDiscount;
    filteredTours[i].bestPrice = bestPrice;
    filteredTours[i].bestPriceDiscount = bestPriceDiscount;
  }
}

function fillPageWithData(data) {
  for (var i = 0; i < data.length; i++) {
    var tour = data[i];
    var item = itemTemplate.clone();

    var images = tour.images;
    $(item).find('#main-pic').attr('src', images[0].url);
    $(item).find('#main-pic-1050').attr('style', 'background-image: url(' + images[0].url + ')');
    if (tour.rating < 5) {
      $(item).find('#review-star5').attr('style', 'display: none;');
      if (tour.rating < 4) {
        $(item).find('#review-star4').attr('style', 'display: none;');
        if (tour.rating < 3) {
          $(item).find('#review-star3').attr('style', 'display: none;');
          if (tour.rating < 2) {
            $(item).find('#review-star2').attr('style', 'display: none;');
            if (tour.rating < 1) {
              $(item).find('#review-star1').attr('style', 'display: none;');
            }
          }
        }
      }
    }
    replaceContent(item, '#review-text', tour.reviews + ' reviews');

    replaceContent(item, '#item-name', tour.name);
    replaceContent(item, '#item-text', tour.description);
    replaceContent(item, '#item-duration', tour.length + ' ' + tour.length_type);
    var cities = tour.cities;
    replaceContent(item, '#item-destinations', cities.length + ' cities');
    replaceContent(item, '#item-start-end', cities[0].name + ' / ' + cities[cities.length - 1].name);
    replaceContent(item, '#item-operator', tour.operator_name);
    var dates = tour.dates;

    replaceContent(item, '#item-price', '$' + tour.bestPrice);
    if (tour.bestPriceDiscount !== undefined) {
      replaceContent(item, '#discount-flag', '-' + tour.bestPriceDiscount);
      $(item).find('#discount-flag').attr('style', 'display: block;');
    } else {
      $(item).find('#discount-flag').attr('style', 'display: none;');
    }
    if (dates[0] !== undefined) {
      replaceContent(item, '#item-date1', getFormattedDateFromString(dates[0].start));
      replaceContent(item, '#item-availability1', dates[0].availability + ' seats left');
      if (dates[0].availability < 10) {
        $(item).find('#item-availability1').attr('class', 'display-inline-block color-warning');
      } else {
        $(item).find('#item-availability1').attr('class', 'display-inline-block');
      }
    }
    if (dates[1] !== undefined) {
      replaceContent(item, '#item-date2', getFormattedDateFromString(dates[1].start));
      replaceContent(item, '#item-availability2', dates[1].availability + ' seats left');
      if (dates[1].availability < 10) {
        $(item).find('#item-availability2').attr('class', 'display-inline-block color-warning');
      } else {
        $(item).find('#item-availability2').attr('class', 'display-inline-block');
      }
    }

    $(item).find('#item-more-button').attr('onclick', 'location.href="' + tour.website + '"');

    $("#items").append(item);
  }
}

function replaceContent(object, tagId, newContent) {
  $(object).find(tagId).contents().replaceWith(newContent);
}

function getFormattedDateFromString(str) {
  var date = new Date(str);
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  return day + ' ' + monthNames[monthIndex];
}