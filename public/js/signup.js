(function() {
  var submit = $('.btn'),
      login = $('.login'),
      form = $('.login form');

  pos();
  window.onresize = function() {
    pos();
  };

  function pos() {
    login[0].style.top = (window.innerHeight - login[0].clientHeight) / 2 + 'px';
  }

  function usernotExists() {
    var h = $('.login form');

    if ($('.wrong').length === 0) {
      h.after('<br><p class="wrong" style="color: #d7694b;">пользователь с таким именем или email уже зарегистрирован</p>');
    }
  }

  $('.login form input').on('blur', function() {
    form.valid();
  });

  submit.on('click', function(e) {
    e.preventDefault();
    if (form.valid()) {
      $.ajax({
        method: 'POST',
        url: '/signup',
        data: form.serialize(),
        success: function(res) {
          if (res === 'registration-failed') {
            usernotExists();
          } else if (res === 'registraion-successful') {
            window.location = '/reader';
          }
        }
      });
    }
  });
})();
