$(document).ready(function () {
    $(document).on('click', '#home-btn', function () {
        window.location.href = '/home';
    });
  
    $.ajax({
      url: '/auth/me',
      method: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data.username) $('#user-name').text(`Zalogowano jako: ${data.username}`);
      },
      error: function (xhr, status, error) {
        console.error('Błąd w pobieraniu produktów', error);
      }
    });

    $.ajax({
      url: '/auth/list',
      method: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        data.users.forEach(u => {
          $('#admin-panel-user-picker').append(`<div data-id="${u.id}"><p>${u.username}</p>
            <input type="checkbox"></div>`);
        });
      },
      error: function (xhr, status, error) {
        console.error('Błąd w pobieraniu listy użytkowników', error);
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
          $('#admin-panel-category-update-picker').append(`<option value="${c.id}">${c.name}</option>`);
          $('#admin-panel-category-delete-picker').append(`<option value="${c.id}">${c.name}</option>`);
        });
      },
      error: function (xhr, status, error) {
        console.error('Błąd w pobieraniu listy użytkowników', error);
      }
    });





    $(document).on('click', '#admin-panel-user-confirm', function () {
      const selectedIds = [];
      $('#admin-panel-user-picker').children().each(function () {
        const checkbox = $(this).children('input[type="checkbox"]');
        if (checkbox.is(':checked')) {
          const id = $(this).data('id');
          selectedIds.push(id);
        }
      });
      const role = $('#admin-panel-user-perm').val();
      $.ajax({
        url: '/auth/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ids: selectedIds, role: role}),
        success: function (data) {
            if (data.success) location.reload();
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd zmiany uprawnień:', error);
        }
      });
    });

    $(document).on('click', '#admin-panel-category-new-confirm', function () {
      const name = $('#admin-panel-category-new-text').val();
      $.ajax({
        url: '/category/new',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name}),
        success: function (data) {
            if (data.success) location.reload();
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd zmiany uprawnień:', error);
        }
      });
    });

    $(document).on('click', '#admin-panel-category-update-confirm', function () {
      const name = $('#admin-panel-category-update-text').val();
      const id = $('#admin-panel-category-update-picker').val();
      $.ajax({
        url: '/category/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({name: name, id: id}),
        success: function (data) {
            if (data.success) {
              location.reload();
            }
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd zmiany uprawnień:', error);
        }
      });
    });

    $(document).on('click', '#admin-panel-category-delete-confirm', function () {
      const id = $('#admin-panel-category-delete-picker').val();
      $.ajax({
        url: '/category/delete',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({id: id}),
        success: function (data) {
            if (data.success) {
              location.reload();
            }
            else {
                console.log('Błąd:', data.message)
            }
        },
        error: function (xhr, status, error) {
            console.error('Błąd zmiany uprawnień:', error);
        }
      });
    });

    
});