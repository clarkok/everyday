"use strict";

(function($, w) {
  $.get('/api/admin/new', function (data) {
    if (data.code !== 0) {
      w.alert(data.error);
      w.location.href="/login.html";
    }
    else {
      $('body').data('entry-id', data.id);
      $('#new-form').append($('<input />').attr({
        type : 'hidden',
        name : 'id',
        value : data.id
      }));
    }
  });
  
  $(function() {
    var DOMNode = function (tag, classname) {
      var node = document.createElement(tag);
      node.className = classname;
      return node;
    };
    
    var ImageListEntry = function(name) {
      var outer = DOMNode('div', 'img-list-outer');
      var inner = DOMNode('div', 'img-list-inner');
      var text = DOMNode('div', 'img-list-text');
      text.textContent = name;
      outer.appendChild(inner);
      outer.appendChild(text);
      
      var ret = $(outer);
      ret.setProgress = function (progress) {
        $(inner).css('width', (progress * 100) + '%');
      };
      ret.setLoad = function () {
        $(inner).css('background-color', 'green');
      };
      ret.setError = function () {
        $(inner).css('background-color', 'red');
      };
      return ret;
    };
    
    $('#upload-btn').on('click', function() {
      var input = document.createElement('input');
      input.type = 'file';
      
      $(input).on('change', function() {
        var form_data = new FormData();
        form_data.append('eid', $('body').data('entry-id'));
        form_data.append('images', this.files[0]);
        
        var img_list_entry = ImageListEntry(this.files[0].name);
        
        var errorHandler = function () {
          img_list_entry.setError();
          console.log('error');
        };
        var xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', function(e) {
          img_list_entry.setProgress(e.loaded / e.total);
          console.log('progress');
        });
        xhr.upload.addEventListener('error', errorHandler);
        xhr.upload.addEventListener('abort', errorHandler);
        
        xhr.addEventListener('error', errorHandler);
        xhr.addEventListener('abort', errorHandler);
        xhr.addEventListener('load', function(e) {
          img_list_entry.setLoad();
          console.log('load');
        });
        
        $('#imgs-list').append(img_list_entry);
        
        xhr.open('POST', '/api/admin/upload');
        xhr.send(form_data);
      }).trigger('click');
    });
    $('#submit').on('click', function() {
      $.post('/api/admin/update',
        $('#new-form').serialize(),
        function (d) {
          if (d.code !== 0) {
            console.log(d.error);
            w.alert(d.error);
          }
          else {
            w.location.href = '/';
          }
        }
      );
    });
  });
})(window.jQuery, window);