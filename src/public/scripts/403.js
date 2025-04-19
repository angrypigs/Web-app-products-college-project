$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('msg');
    if (message) {
        $('#msg').text(message);
    }
});