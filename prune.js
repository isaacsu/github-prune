var _mounted = false;

function handleTabClick(ev) {
  //console.log(ev.currentTarget.getAttribute('data-container-id'));
  //var containerId = ev.currentTarget.getAttribute('data-container-id');

  if (_mounted) return true;
  if (1 || containerId == 'files_bucket') {
    var diffs = _.chain(document.querySelectorAll('div.js-details-container'))
      .filter(function(el) { return el.getAttribute('id').indexOf('diff-') === 0 })
      .map(function(el) {
        var meta = _.find(el.children, function(child) { 
          return child.getAttribute('class').indexOf('meta') != -1;
        });

        meta.addEventListener('click', function(ev) {
          var data = _.find(ev.currentTarget.parentNode.children, function(child) {
            return child.getAttribute('class').indexOf('data') != -1;
          });

          if (data.style.display == '' || data.style.display == 'block') {
            data.style.display = 'none';
          }
          else {
            data.style.display = 'block';
          }
          console.log(ev.currentTarget.getAttribute('data-path'));
        });
        return el;
      })
    .value();
    _mounted = true;
  }
}

window.addEventListener('load', function() {
  var tabs = document.getElementsByClassName('js-pull-request-tab');
  _.forEach(tabs, function(tab) {
    tab.addEventListener('click', handleTabClick);
  });
  handleTabClick();
});
