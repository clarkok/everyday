"use strict";

(function (r, w) {
  w.PSRoot = r.createClass({
    render : function () {
      return (
        <div className="pswp" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="pswp__bg"></div>
            <div className="pswp__scroll-wrap">
              <div className="pswp__container">
                <div className="pswp__item"></div>
                <div className="pswp__item"></div>
                <div className="pswp__item"></div>
              </div>
              <div className="pswp__ui pswp__ui--hidden">
                <div className="pswp__top-bar">
                  <div className="pswp__counter"></div>
                  <div className="pswp__preloader">
                    <div className="pswp__preloader__icn">
                      <div className="pswp__preloader__cut">
                      <div className="pswp__preloader__donut"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div className="pswp__share-tooltip"></div> 
              </div>
              <div className="pswp__caption">
                <div className="pswp__caption__center"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  });
})(window.React, window);

