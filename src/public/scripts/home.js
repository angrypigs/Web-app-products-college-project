let page = 1;
const limit = 6;
let isLastPage = false;
let isFirstPage = true;

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

  $(document).on('click', '.productsListProduct', function () {
    const id = $(this).find('.productsListProductRemove').data('id');
    window.location.href = `/home/product?id=${id}`;
  });

  $(document).on('click', '.productsListProductRemove', function (e) {
    e.stopPropagation();
    const id = $(this).data('id');
    if (confirm("Czy na pewno chcesz usunąć ten produkt?")) {
      $.ajax({
        url: '/product/delete',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: parseInt(id)}),
        success: function (data) {
            if (data.success) window.location.href = "/home";
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd logowania:', error);
        }
      });
    }
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
      if (is_admin) $('#header').append('<div id="admin-btn" class="button">Panel admina</div>')
      load_products(is_admin);
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });

  $(document).on('click', '#admin-btn', function () {
    window.location.href = "/admin";
  })

  $(document).on('click', '#filter-refresh', function () {
    load_products(is_admin);
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Enter') {
      load_products(is_admin);
    }
  });

  $(document).on('click', '#pagination-left', function () {
    page = Math.max(page - 1, 1);
    $('#pagination-index').text('' + page);
    load_products(is_admin);
  });

  $(document).on('click', '#pagination-right', function () {
    page += 1;
    $('#pagination-index').text('' + page);
    load_products(is_admin);
  });
  
});


function load_products(is_admin) {
  $('#products-list').empty();
  const phrase = $('#filter-name').val();
  $.ajax({
    url: `/product?phrase=${phrase}&page=${page}&limit=${limit}`,
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(res) {
      isFirstPage = res.isFirstPage;
      isLastPage = res.isLastPage;
      $('#pagination-left').css('display', (isFirstPage) ? 'none' : 'block')
      $('#pagination-right').css('display', (isLastPage) ? 'none' : 'block')
      res.products.forEach(p => {
        let product = `<div class="productsListProduct"><p>${p.title}</p>`
        if (is_admin) product += `<div class="productsListProductRemove button" data-id="${p.id}">X</div>`;
        $('#products-list').append(`${product}</div>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });
}

 