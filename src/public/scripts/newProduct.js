$(document).ready(function () {
    $.ajax({
        url: '/category',
        method: 'GET',
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          data.categories.forEach(c => {
            $('#newProductCategoryPicker').append(`<label>
            <input type="checkbox" value="${c.id}">${c.name}</label>`);
          });
        },
        error: function (xhr, status, error) {
          console.error('Błąd w pobieraniu listy użytkowników', error);
        }
      });

    $('#newProductForm').submit(function (e) {
        e.preventDefault();
        const title = $('#newProductTitle').val();
        const desc = $('#newProductDesc').val();
        const img = $('#newProductImg').val();
        let categories = [];
        $('#newProductCategoryPicker').find('input[type="checkbox"]').each(function () {
          if ($(this).prop('checked')) categories.push($(this).val());
        });
        $.ajax({
            url: '/product/new',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({title: title, 
              description: desc, 
              imageUrl: img,
              categoryIds: categories
            }),
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
  