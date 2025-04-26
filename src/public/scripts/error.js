$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
        $('#msg').text(message);
    }
    $(document).on('click', '#login-back', function () {
        window.location.href = '/';
    })
});