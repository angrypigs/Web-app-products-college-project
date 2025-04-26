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
    
});