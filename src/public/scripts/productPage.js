let focused_comment = -1;

$(document).ready(function () {

  $(document).on('click', '#home-btn', function () {
    window.location.href = '/home';
  });

  let is_admin = false;
  let username = '';
  $.ajax({
    url: '/auth/me',
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      if (data.username) {
        $('#user-name').text(`Zalogowano jako: ${data.username}`);
        username = data.username;
      }
      is_admin = (data.role === "admin");
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  $.ajax({
    url: `/product/data?id=${id}`,
    method: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      console.log(data)
      $('#product-title').text(`Nazwa: ${data.title}`);
      $('#product-desc').text(`Opis: ${data.description}`);
      if (data.imageUrl) $('#product-img').attr('src', data.imageUrl);
      else $('#product-img').hide();
      data.Comments.forEach(c => {
        console.log(c);
        const date = new Date(c.creationDate);
        const formatted = date.toLocaleString('pl-PL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        let comment = `<div class="comment" data-info="${(is_admin || c.User.username === username) ? "yes" : "no"}" data-id="${c.id}">
        <p>${c.description}</p><i>${c.User.username}, ${formatted}</i>`
        $('#product-comments-box').append(`${comment}</div>`);
      });
      data.Categories.forEach(ct => {
        $('#categories-list').append(`<li>${ct.name}</li>`)
      })
    },
    error: function (xhr, status, error) {
      console.error('Błąd w pobieraniu produktów', error);
    }
  });

  $('#newCommentForm').submit(function (e) {
    e.preventDefault();
    const desc = $('#newCommentText').val();
    $.ajax({
        url: '/comment/new',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({description: desc, productId: id}),
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
  });

  $(document).on('click', '.comment', function(e) {
    $('.comment').removeClass('comment-active');
    if ($(this).data('info') === 'yes') {
      focused_comment = $(this).data('id');
      $('#change-comment-name').val($(this).find('p').first().text());
      $('#change-comment-menu').css('display', 'flex');
      $(this).addClass('comment-active');
    } else {
      $('#change-comment-menu').css('display', 'none');
      focused_comment = -1;
    }
  });

  $(document).on('click', '#change-comment-btn', function () {
    
    let text = $('#change-comment-name').val();
    console.log(text, focused_comment);
    if (text && (focused_comment !== -1)) {
      $.ajax({
        url: '/comment/update',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({newDescription: text, commentId: parseInt(focused_comment)}),
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
  });

  $(document).on('click', '#delete-comment-btn', function () {
    if (focused_comment !== -1) {
      $.ajax({
        url: '/comment/delete',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({commentId: parseInt(focused_comment)}),
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

  
});



 