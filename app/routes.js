var passport = require('passport'),
    path = require('path'),
    User = require(path.join(__dirname, 'models', 'user')),
    subscribe = require(path.join(__dirname, 'modules', 'subscribitions')),
    feedparser = require('feedparser');


module.exports = function(app) {
  app.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/reader');
    } else {
      res.render('index', {
        title : app.get('title'),
        user: req.user,
        script: 'login'
      });
    }
  });


  app.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      req.logIn(user, function(err) {
        if (err) { res.send('login-failed', 200); }
        res.send('login-successful', 200);
      });
    })(req, res, next);
  });


  app.get('/403', function(req, res, next) {
    var err = new Error('Not allowed');
    err.status = 403;
    next(err);
  });


  app.get('/404', function(req, res, next) {
    next();
  });


  app.get('/500', function(req, res, next) {
    next(new Error('Server error'));
  });


  app.get('/signup', function(req, res) {
    res.render('signup', {
      title : app.get('title') + ' | Register',
      script: 'signup'
    });
  });


  app.post('/signup', function(req, res) {
    User.register(new User({username: req.body.email}), req.body.pass, function(err, user) {
      if (err) {
        res.send('registration-failed', 200);
      } else {
        req.logIn(user, function(err) {
          res.send('registraion-successful', 200); // check public/js/signup.js submit.on()
        });
      }
    });
  });


  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  app.get('/reader', function(req, res) {
    if (req.user) {
      User.findOne({_id: req.user._id}, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          res.render('reader', {
            title: app.get('title'),
            user: req.user,
            script: 'main',
            subscriptions: user.subscriptions
          });
        }
      });
    } else {
      res.redirect('/');
    }
  });


  app.post('/get-feed', function(req, res) {
    if (!req.user) {
      res.send('Error occured.', 403);
    } else {
      User.findById(req.user._id, function(err, user) {
        var articles = [],
            url = null;
        
        for (var i = 0, sl = user.subscribitions.length; i < sl; i++) {
          var subscription_title = user.subscribitions[i].title;

          if (subscribition_title === req.body.title) {
            url = subscribition_title;
          }
        }

        feedparser.parseUrl(url)
                  .on('article', function(article) {
                    articles.push(article);
                  })
                  .on('complete', function() {
                    res.send(articles, 200);
                  });
      });
    }
  });


  app.post('/subscribe', function(req, res) {
    var articles = [];

    feedparser.parseUrl(req.body.subscriptionUrl)
              .on('article', function(article) {
                 articles.push(article);
              })
              .on('complete', function(info) {
                var feed = {
                  title: info.title,
                  url: req.body.subscriptionUrl,
                  unread: articles.length
                };

                req.user.subscriptions.push(feed);
                User.findById(req.user._id, function(err, user) {
                  user.subscriptions = req.user.subscriptions;
                  res.send({title: info.title, feed: articles}, 200);
                });
              });
  });

}

