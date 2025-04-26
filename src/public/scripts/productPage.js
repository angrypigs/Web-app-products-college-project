$(document).ready(function () {

  $(document).on('click', '#home-btn', function () {
    window.location.href = '/home';
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
      $('#product-title').text(`Nazwa: ${data.title}`);
      $('#product-desc').text(`Opis: ${data.description}`);
      data.Comments.forEach(c => {
        const date = new Date(c.creationDate);
        const formatted = date.toLocaleString('pl-PL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        let comment = `<div class="comment"><p>${c.description}</p><i>${c.User.username}, ${formatted}</i>`
        $('#product-comments-box').append(`${comment}</div>`);
      });
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

});



 