let page = 1;
const limit = 6;
let isLastPage = false;
let isFirstPage = true;

let focused_product = -1;

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

  $(document).on('click', '.productsListProductRemove', function (e) {
    e.stopPropagation();
    const id = $(this).parent().data('id');
    console.log(id)
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

  $.ajax({
    url: '/category',
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      data.categories.forEach(c => {
        $('#filter-category').append(`<option value="${c.id}">${c.name}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu listy użytkowników', error);
    }
  });

  $(document).on('click', '.productsListProductUpdate', function (e) {
    e.stopPropagation();
    let product = $(this).parent();
    $('.productsListProduct').removeClass('productsListProductActive');
    if (is_admin) {
      $('#edit-product-title').val($(product).find('p').first().text());
      let product_desc = $(product).data('desc');
      if (product_desc) $('#edit-product-desc').val(product_desc);
      else $('#edit-product-desc').val('');
      let product_img = $(product).find('img').first().attr('src');
      if (product_img) $('#edit-product-img').val(product_img);
      else $('#edit-product-img').val('');
      $(product).addClass('productsListProductActive');
      focused_product = $(product).data('id');
      $('#edit-product-menu').css('display', 'flex');
    } else {
      focused_product = -1;
      $('#edit-product-menu').css('display', 'none');
    }
  })

  $(document).on('click', '#edit-product-btn', function () {
    let product_title = $('#edit-product-title').val();
    let product_desc = $('#edit-product-desc').val();
    let product_img = $('#edit-product-img').val();
    console.log(focused_product)
    if (focused_product !== -1 && product_title !== '') {
      $.ajax({
        url: '/product/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          productId: parseInt(focused_product),
          title: product_title,
          description: product_desc,
          imageUrl: product_img
        }),
        success: function (data) {
            if (data.success) location.reload();
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd logowania:', error);
        }
      });
    }
  })

  $(document).on('click', '.productsListProduct', function (e) {
      const id = $(this).data('id');
      window.location.href = `/home/product?id=${id}`;
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
  let category_id = $('#filter-category').val();
  if (category_id) category_id = `&id=${category_id}`;
  $.ajax({
    url: `/product?phrase=${phrase}&page=${page}&limit=${limit}${category_id}`,
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(res) {
      isFirstPage = res.isFirstPage;
      isLastPage = res.isLastPage;
      console.log(`Is first page: ${isFirstPage}, Is last page: ${isLastPage}`)
      $('#pagination-left').css('display', (isFirstPage) ? 'none' : 'block')
      $('#pagination-right').css('display', (isLastPage) ? 'none' : 'block')
      res.products.forEach(p => {
        let product = `<div class="productsListProduct" data-id="${p.id}" data-desc="${p.description}">
        <p>${p.title}</p>`
        if (p.imageUrl) product += `<img src=${p.imageUrl}>` 
        if (is_admin) product += `<div class="productsListProductUpdate button">&#x270F;</div>
        <div class="productsListProductRemove button">X</div>`;
        $('#products-list').append(`${product}</div>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });
}

 