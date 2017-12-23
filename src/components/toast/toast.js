
import './_toast.less';
import $ from 'jquery';

var toastit_id = String('id'+Math.random()).replace('.','');
var toastit = function (text, timeout ) {
  var timeout = timeout || 3000;
  var html = $(`<div id="${toastit_id}" class="dialog__toast-box">${text}</div>`);

  $('body').append(html);

  html.css({
    left:$(window).width() / 2 - html.width() / 2,
    top: html.height(),
    opacity:0
  }).animate({
	top:20,
	opacity:1
  },160);

  setTimeout(function () {
	html.fadeOut(function () {
	  html.remove();
	});
  }, timeout);

}

export default toastit;