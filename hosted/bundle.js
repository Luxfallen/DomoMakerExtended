'use strict';

/* eslint-disable */

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
  });
};

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  }

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var handleDomoDel = function handleDomoDel(e) {
  var key = JSON.stringify(e.target.parentElement.getAttribute('data-key'));
  var token = $('#csrf').serialize();
  var obj = '_id=' + key + '&' + token;
  sendAjax('DELETE', '/delDomo', obj, function (msg) {
    console.dir(msg);
  });
  e.target.parentElement.hidden = true;
  loadDomosFromServer();
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    { id: 'domoForm', onSubmit: handleDomo, name: 'domoForm', action: '/maker', method: 'POST', className: 'domoForm' },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'rawrLevel' },
      'Level: '
    ),
    React.createElement('input', { id: 'domoRawr', type: 'number', min: '1', max: '9001', name: 'rawrLevel', placeholder: 'RAWR' }),
    React.createElement('input', { type: 'hidden', id: 'csrf', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  if (props.domos.length === 0) {
    return React.createElement(
      'div',
      { className: 'domoList' },
      React.createElement(
        'h3',
        { classname: 'emptyDomo' },
        'No Domos Yet'
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      'div',
      { key: domo._id, 'data-key': domo._id, className: 'domo' },
      React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
      React.createElement(
        'h3',
        { className: 'domoName' },
        ' Name: ',
        domo.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoAge' },
        ' Age: ',
        domo.age,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'domoRawr' },
        ' RAWR Level: ',
        domo.rawrLevel,
        ' '
      ),
      React.createElement('input', { type: 'button', className: 'domoDelete', value: 'Delete', onClick: handleDomoDel })
    );
  });

  return React.createElement(
    'div',
    { className: 'domoList' },
    domoNodes
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));
  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));
  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

/* eslint-disable */
// Must ask about this. It feels wrong.

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
