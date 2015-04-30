"use strict";

(function (r, w) {
  w.Gallery = r.createClass({
    componentDidMount : function () {
      var $this = $(React.findDOMNode(this));
      var pswpElement = $this.find('.pswp').get(0);

      this.gallery = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        this.props.data,
        {
          index: 0,
          pinchToClose: false,
          modal: false,
          closeOnScroll: false,
          closeOnVerticalDrag: false
        }
      );
      this.gallery.init();
      window.test = this.gallery;
    },

    render : function () {
      return (
        React.createElement("div", {className: "gallery parent"}, 
          React.createElement(PSRoot, null)
        )
      );
    }
  });
})(window.React, window);

(function (r, w) {
  w.Page = r.createClass({
    getInitialState : function () {
      return {
        load: false,
        data: {}
      };
    },

    componentDidMount : function () {
      var _this = this;

      $.get('/api/get/' + this.props.entryId, function (d) {
        if (d.code) {
          console.log(d.error);
          w.alert(d.error);
        }
        else {
          console.log(d);
          _this.setState({
            load: true,
            data: d.data
          });
          $(React.findDOMNode(_this)).find('.touch-mask').swipe({
            swipe: function (event, direction) {
              $('body').trigger(direction);
            }
          });
        }
      });
    },

    render : function () {
      var pListFromContent = function (content) {
        if (content)
          return content.split('\n').map(function (item) {
            return React.createElement("p", null, item);
          });
        else
          return React.createElement("p", null, "Loading");
      };

      if (this.state.load)
        return (
          React.createElement("section", {className: "page", style: {left:this.props.offset}}, 
            React.createElement("div", {className: "wrapper"}, 
              React.createElement(Gallery, {data: this.state.data.images}), 
              React.createElement("div", {className: "meta"}, 
                React.createElement("span", {className: "time"}, 
                  moment(this.state.data.date).format('MMM D YYYY')
                )
              ), 
              React.createElement("div", {className: "content"}, 
                pListFromContent(this.state.data.content)
              ), 
              React.createElement("div", {className: "touch-mask"})
            )
          )
        );
      else
        return (
          React.createElement("section", {className: "page"}, 
            React.createElement("div", {className: "load-mask loading"})
          )
        );
    }
  });
})(React, window);
