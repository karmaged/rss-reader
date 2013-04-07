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

  function usernotFound() {
    var h = $('.login .signup');

    if ($('.wrong').length === 0) {
      h.after('<br><p class="wrong" style="color: #d7694b;">неверный логин или пароль</p>');
    }
  }

  $('.login form input').on('blur', function() {
    if (!form.valid()) {
      usernotFound();
    }
  });

  submit.on('click', function(e) {
    e.preventDefault();
    if (form.valid()) {
      $.ajax({
        method: 'POST',
        url: '/',
        data: form.serialize(),
        success: function(res) {
          if (res === 'login-failed') {
            usernotFound();
          } else if (res === 'login-successful') {
            window.location = '/reader';
          }
        }
      });
    }
  });
})();
