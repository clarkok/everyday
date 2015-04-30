"use strict";

(function ($, w) {
  $('#login-submit').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $.post('/api/login', {
      username : $('#login-username').val(),
      password : $('#login-password').val()
    }, function (result) {
      if (result.code == 0) {
        w.location.href = '/admin.html'
      }
      else {
        w.alert(result.error);
      }
    });
    return false;
  });
})(window.jQuery, window);