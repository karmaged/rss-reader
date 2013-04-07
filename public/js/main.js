(function() {
  var aside = $('.menu'),
      search = $('.search input'),
      subscBtn = $('.subscribe-btn'),
      subscCont = $('.subscribe-new'),
      subscBtnSend = $('.subscribe-new .btn'),
      logout = $('.profile span'),
      subscribitionsList = $('.main-list'),
      feedCont = $('section.feed'),
      q = 480 / 450,
      feedHeight = 0;

  pos();
  window.onresize = function() {
    pos();
  };

  function pos() {
    aside[0].style.height = feedCont[0].style.height = window.innerHeight - 75 + 'px';
  }

  subscBtn.on('click', function() {
    subscCont.toggle();
    $('.subscribe-new .fill').focus();
  });

  subscBtnSend.on('click', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/subscribe',
      data: $('.subscribe-new form').serialize(),
      success: function(res) {
        console.log('Feed Added Successfully');
        subscCont.hide();
        updateSubscribitionsList(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  logout.on('click', function() {
    $('.profile').submit();
  });

  $('.sub-name').on('click', function() {
    var that = $(this);

    $.ajax({
      type: 'POST',
      url: '/get-feed',
      data: {"title": that.html()},
      success: function(res) {
        buildFeed(res);
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  function updateSubscribitionsList(res) {
    var feed = res.feed,
        title = res.title,
        unreadCount = feed.length,
        string;

    if (unreadCount > 0) {
      unreadCount = '('+unreadCount+')';
    }

    string = title.length + unreadCount.length;

    if (string > 21) {
      title = title.split('');
      for (i = string; i > 18; i--) {
        title = title.slice(0, -1);
      }
      title.push('...');
      title = title.join('');
    }

    subscribitionsList.append('<li><i class="sub icon"></i><span class="sub-name">'+title+'</span><span class="unread-num">'+unreadCount+'</span></li>');
  }

  function buildFeed(res) {
    var data = res;

    feedCont.html('');
    for (var i = 0, fl = data.length; i < fl; i++) {
      var a = data[i];

      feedCont.append('<article class="article"><header class="post-header"><h2>' + a.title + '</h2><i class="icon star"></i></header></article>');
      feedCont.children('article').last().append('<div class="content"><p>' + a.description + '</p></div>');
      feedCont.children('article').last().append('<footer class="post-footer"><ul><li><i class="icon star"></i></li><li><span>Поделиться</span></li></ul></footer>');
    }
    pos();
    for (i = 0, al = $('.article').length; i < al; i++) {
      feedHeight = feedHeight + $('.article')[i].clientHeight;
    }
  }

  // feedCont.on('scroll', function() {

  // });
})();
