(function() {
  var aside = $('.menu'),
      search = $('.search input'),
      q = 480/450;

  pos();
  window.onresize = function() {
    pos();
  };

  function pos() {
    aside[0].style.height = document.height - 75 + 'px';
  }
})();