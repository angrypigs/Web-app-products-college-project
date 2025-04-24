$(document).ready(function () {
  $(document).on('click', '#logout-btn', function () {
    $.ajax({
      url: '/home/logout',
      method: 'POST',
      success: function () {
          window.location.href = '/';
      },
      error: function (xhr, status, error) {
        console.error('Błąd w wylogowaniu', error);
      }
    });
  });

  $(document).on('click', '#new-product-btn', function () {
    window.location.href = '/home/new-product';
  });

  let is_admin = false;
  $.ajax({
    url: '/auth/me',
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if (data.username) $('#user-name').text(`Zalogowano jako: ${data.username}`);
      is_admin = (data.role === "admin");
      load_products(is_admin);
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });
  
});


function load_products(is_admin) {
  $('#products-list').empty();
  $.ajax({
    url: '/product',
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(products) {
      products.forEach(p => {
        let product = `<div class="productsListProduct"><p>${p.title}</p><p>${p.description}</p>`
        if (is_admin) product += '<div class="productsListProductRemove button">X</div>'
        $('#products-list').append(`${product}</div>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });
}