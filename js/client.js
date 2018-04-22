// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
     console.log('Connected to server!');
  });

  
  window.makeQuestionPreview = function (question) {
    var html = [
      '<li data-question-id="' + question.id + '" class="question-preview"><h1><span class="preview-content">' +
      question.text + '</span></h1><p><em>Author: ' + question.author + '</em></p>'
    ];
    html.join('');
    return html;
  };

  // You will now need to implement both socket handlers,
  // as well as click handlers.

  window.socket.on('here_are_the_current_messages', function(data) {
    for (var i in data) {
      $('.question-list').prepend(window.makeQuestionPreview(data[i]));
    }
  });

  $('#submitQuestion').on('click', function () {
   if ($('#question-text').val() != ''){
    var questionasked = { text: $('#question-text').val() };
    window.socket.emit('add_new_question', questionasked);
   }

  });

  window.socket.on('new_question_added', function(data) {
    $('.question-list').prepend(window.makeQuestionPreview(data));
  });

  $(document).on('click', '.question-preview', function() {
    window.socket.emit('get_question_info', parseInt($(this).attr('data-question-id')));
  } );

  window.socket.on('question_info', function(data) {
    //Try with html and append
    if (data) {
      $('.question-view').html(window.makeQuestion(data));
    }
  });

 

  window.socket.on('answer_added', function(data) {
      var $obj = $('#answer');
      if ($('.question-view').find('.question').get(0).attr('data-question-id') == data.id) {
        $('.question-view').html(window.makeQuestion(data));
      }
  });


});