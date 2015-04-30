"use strict";

(function (r, w) {
  w.PSRoot = r.createClass({
    render : function () {
      return (
        React.createElement("div", {className: "pswp", tabindex: "-1", role: "dialog", "aria-hidden": "true"}, 
          React.createElement("div", {className: "pswp__bg"}), 
            React.createElement("div", {className: "pswp__scroll-wrap"}, 
              React.createElement("div", {className: "pswp__container"}, 
                React.createElement("div", {className: "pswp__item"}), 
                React.createElement("div", {className: "pswp__item"}), 
                React.createElement("div", {className: "pswp__item"})
              ), 
              React.createElement("div", {className: "pswp__ui pswp__ui--hidden"}, 
                React.createElement("div", {className: "pswp__top-bar"}, 
                  React.createElement("div", {className: "pswp__counter"}), 
                  React.createElement("div", {className: "pswp__preloader"}, 
                    React.createElement("div", {className: "pswp__preloader__icn"}, 
                      React.createElement("div", {className: "pswp__preloader__cut"}, 
                      React.createElement("div", {className: "pswp__preloader__donut"})
                    )
                  )
                )
              ), 
              React.createElement("div", {className: "pswp__share-modal pswp__share-modal--hidden pswp__single-tap"}, 
                React.createElement("div", {className: "pswp__share-tooltip"})
              ), 
              React.createElement("div", {className: "pswp__caption"}, 
                React.createElement("div", {className: "pswp__caption__center"})
              )
            )
          )
        )
      )
    }
  });
})(window.React, window);
