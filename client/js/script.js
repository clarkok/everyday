"use strict";

var s = document.createElement('section');
document.body.appendChild(s);

React.render(
  React.createElement(Page, {url: "/api/get/0"}),
  s
);
