"use strict";

(function (r, w) {
  w.Gallery = r.createClass({
    render : function () {
      var imageListItemFromList = function (data) {
        return data.map(function (item) {
          return (
            React.createElement("li", null, 
              React.createElement("img", {src: item})
            )
          );
        });
      }

      return (
        React.createElement("ul", {className: "gallery"}, 
          imageListItemFromList(this.props.data)
        )
      )
    }
  })
})(window.React, window);

(function (r, w) {
  w.Page = r.createClass({
    render : function () {
      var pListFromContent = function (content) {
        return content.split('\n').map(function (item) {
          return React.createElement("p", null, item);
        })
      }

      return (
        React.createElement("section", {className: "page"}, 
          React.createElement(Gallery, {data: this.props.data.images}), 
          React.createElement("div", {className: "meta"}, 
            React.createElement("span", {className: "time"}, this.props.data.date)
          ), 
          React.createElement("div", {className: "content"}, 
            pListFromContent(this.props.data.content)
          )
        )
      );
    }
  })
})(React, window);
