$(document).ready(function () {
    $('#newProductForm').submit(function (e) {
        e.preventDefault();
        const title = $('#newProductTitle').val();
        const desc = $('#newProductDesc').val();
        $.ajax({
            url: '/product/new',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({title: title, description: desc}),
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
    });
  
});
  