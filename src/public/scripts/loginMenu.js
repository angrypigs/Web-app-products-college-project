$(document).ready(function () {
    $('#registerForm').submit(function (e) {
      e.preventDefault();
      const username = $('#registerUsername').val();
      const password = $('#registerPassword').val();
      $.ajax({
        url: '/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function (data) {
          alert("Zarejestrowano pomyślnie")
        },
        error: function (xhr, status, error) {
          console.error('Błąd rejestracji:', error);
        }
      });
    });

    $('#loginForm').submit(function (e) {
        e.preventDefault();
        const username = $('#loginUsername').val();
        const password = $('#loginPassword').val();
        $.ajax({
            url: '/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (data) {
                console.log(data)
                window.location.href = "/home";
            },
            error: function (xhr, status, error) {
                console.error('Błąd logowania:', error);
            }
        });
    });
});