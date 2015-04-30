"use strict";

var page = 0;
var current_list = [];
var current_index = 0;

var listPage = function (page, cb) {
  $.get('/api/list/' + page, function(d) {
    if (d.code !== 0) {
      console.log(d.error);
      window.alert(d.error);
    }
    else {
      current_list = current_list.concat(d.data);
      console.log(d.data);
      console.log(current_list);
    }
    if (cb)
      cb.call(window);
  });
};

var List = React.createClass({
  getInitialState : function () {
    return {
      current_index : 0,
      current_list : [],
      current_page : 0
    };
  },
  componentDidMount : function () {
    var _this = this;
    if (this.state.current_index >= this.state.current_list.length - 2) {
      listPage(page++, function () {
        _this.setState({
          current_page : page,
          current_list : current_list,
          current_index : _this.state.current_index
        });
        console.log(_this.state);
      });
    };
    $('body')
    .on('right', function () {
      var index = _this.state.current_index - 1;
      _this.setState({
        current_page : page,
        current_list : current_list,
        current_index : index < 0 ? 0 : index
      });
    })
    .on('left', function () {
      var index = _this.state.current_index + 1;
      _this.setState({
        current_page : page,
        current_list : current_list,
        current_index : 
          index >= current_list.length ? current_list.length - 1 : index
      });
    });
  },
  render : function () {
    var _this = this;
    return (
      <section id="wrapper">
        <a href="admin.html" id="add">+</a>
        {
          this.state.current_list.map(function (item, index) {
            return (
              <Page 
                entryId={item}
                key={index}
                offset={index == _this.state.current_index ? 0 :
                  (index < _this.state.current_index ? '-100%' : '100%')
                } />)
          })
        }
      </section>
    );
  }
});

window.l = <List />;

React.render(
  window.l,
  document.body
);