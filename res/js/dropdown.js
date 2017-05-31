function toggleDropdown() {
  document.getElementById('sortingDropdown').classList.toggle("show");
}

function changeSortingCaption(newCaption) {
  $('#sorting-caption').contents().replaceWith(newCaption);
}