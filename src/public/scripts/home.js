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
});