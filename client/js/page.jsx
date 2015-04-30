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
        <div className="gallery parent">
          <PSRoot />
        </div>
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
            return <p>{item}</p>;
          });
        else
          return <p>Loading</p>;
      };

      if (this.state.load)
        return (
          <section className="page" style={{left:this.props.offset}}>
            <div className="wrapper">
              <Gallery data={this.state.data.images} />
              <div className="meta">
                <span className="time">
                  {moment(this.state.data.date).format('MMM D YYYY')}
                </span>
              </div>
              <div className="content">
                {pListFromContent(this.state.data.content)}
              </div>
              <div className="touch-mask" />
            </div>
          </section>
        );
      else
        return (
          <section className="page">
            <div className="load-mask loading" />
          </section>
        );
    }
  });
})(React, window);
