var _mounted = false;
var _parents = {};

  //console.log(ev.currentTarget.getAttribute('data-container-id'));
  //var containerId = ev.currentTarget.getAttribute('data-container-id');


  /*
    background:#dcdcdc;
    box-shadow:inset 0 3px 5px rgba(0,0,0,0.15);
    color: #6a6

    background:#8c8;
    box-shadow:inset 0 3px 5px rgba(0,0,0,0.15);

    <a href="#" class="minibutton" style="background:#9c9;box-shadow:inset 0 3px 5px rgba(0,0,0,0.15);">Done</a>

    document.querySelectorAll('div.js-details-container.file .meta .actions .button-group')

    document.querySelectorAll('.data')[5].getBoundingClientRect().top

    .meta style = position:fixed;top:0;width:918px
  */


function prId(pathname) {
  var re = /\/([^\/]+)\/([^\/]+)\/pull\/(\d+)\/.*/;
  var matches = re.exec(pathname);
  return matches.splice(1).join('$');
}

function storageKey() {
  return 'supr:' + prId(location.pathname);
}

function md5(str) {
  return CryptoJS.MD5(str).toString(CryptoJS.enc.Base64);
}

function set(file, hash) {
  var store = window.localStorage;
  var data = JSON.parse(store.getItem(storageKey()));
  data[file] = hash;
  store.setItem(storageKey(), JSON.stringify(data));
}

function unset(file) {
  var store = window.localStorage;
  var data = JSON.parse(store.getItem(storageKey()));
  if (data[file]) {
    delete data[file];
    store.setItem(storageKey(), JSON.stringify(data));
  }
}

function list() {
  var store = window.localStorage;
  return JSON.parse(store.getItem(storageKey()));
}

function reset() {
  console.log('resetting', storageKey());
  window.localStorage.setItem(storageKey(), JSON.stringify({}));
}

function getParent(file) {
  if (_.isUndefined(_parents[file])) {
    _parents[file] = Zepto(
      Zepto('div.meta[data-path="' + file + '"]')
        .closest('div.file.js-details-container'));
  }
  return _parents[file];
}

function toggle(file) {
  var $parent = getParent(file);
  var $data = Zepto($parent.find('.data')[0]);
  var $meta = Zepto($parent.find('.meta')[0]);

  if ($data.css('display') == 'block' || $data.css('display') == '') {
    hide(file);
  }
  else {
    show(file);
  }
}

function show(file) {
  var $parent = getParent(file);
  var $data = Zepto($parent.find('.data')[0]);
  var $meta = Zepto($parent.find('.meta')[0]);

  console.log('showing', $parent);
  unset($meta.attr('data-path'));
  $data.css('display', 'block');
  Zepto('.supr-done', $meta).removeClass('supr-done-active');
}

function hide(file) {
  var $parent = getParent(file);
  var $data = Zepto($parent.find('.data')[0]);
  var $meta = Zepto($parent.find('.meta')[0]);

  console.log('hiding', $parent);
  $data.css('display', 'none');
  set($meta.attr('data-path'), md5($data.html()));
  Zepto('.supr-done', $meta).addClass('supr-done-active');
}

function boot() {
  console.log(list());
  _.forIn(list(), function(v, k) {
    hide(k);
  });
}

function mount() {
  if (_mounted) return true;
  
  var files = Zepto('#files > div.file.js-details-container');

  Zepto('.meta > .actions > .button-group', files)
    .append('<a href="#" class="minibutton supr-done" style="">Done</a>')
    .on('click', function(ev) {
      ev.preventDefault();

      var $parent = Zepto(
        Zepto(ev.currentTarget)
          .closest('div.file.js-details-container'));

      var $meta = Zepto($parent.find('.meta')[0]);
      toggle($meta.attr('data-path'));
    });

  $menu = Zepto('<div><a href="" class="minibutton supr-menu">Menu</a><a href="" class="minibutton supr-set">Set</a></div>')
    .css('position', 'fixed')
    .css('top', '10px')
    .css('right', '10px');

  Zepto('.supr-menu', $menu).on('click', function(ev) {
    ev.preventDefault();
  });


  Zepto('.supr-set', $menu).on('click', function(ev) {
    ev.preventDefault();
    reset();
  });

  Zepto('body').append($menu);

  boot();
  _mounted = true;
}

window.addEventListener('load', function() {
  //var tabs = document.getElementsByClassName('js-pull-request-tab');
  //_.forEach(tabs, function(tab) {
  //  tab.addEventListener('click', handleTabClick);
  //});
  mount();
});
