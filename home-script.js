$(document).ready(function() {

    // Get the modal
    var modal = document.getElementById("formModal");

    // Get the button that opens the modal
    var addBtn = document.getElementById("add-button");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    addBtn.onclick = function() {
        modal.style.display = "block";
        $('.modal-header-txt').html("Add New Recommendation Book");
        var formModal = '<form method="POST" id="modal-form" onsubmit="return false;">'+
            '<label for="bookTitle">Book Title</label>'+
            '<input type="text" name="title" id="bookTitle" placeholder="Enter Book Title">'+
            '<label for="bookTitle">Book Category</label>'+
            '<input type="text" name="category" id="bookCategory" placeholder="Enter Book Category">'+
            '<label for="bookDesc">Book Description</label>'+
            '<textarea name="description" id="bookDesc" placeholder="Enter Book Description"></textarea>'+
            '<br>'+
            '<button id="bookAddbtn">Add Book</button>'+
        '</form>'
        $('.modal-body').append(formModal);

        // User click button, do submit
    $("#modal-form").submit(function(e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        // form = $(this).serializeArray();
        // formData = JSON.stringify(form);
        var form = serialize_form(this);
        var add_url = "https://fullstack-book.ariefdfaltah.com/book/create?key="+key;
        console.log(form);
        $.ajax({
                type: "POST",
                url: add_url,
                data: form,
                dataType: "json",
                contentType: "application/json",
                success: function(data)
                {
                    alert("Succesfully adding new recommendation book"); // show response from the php script.
                    location.reload();
                }
            });
        })
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
        $('.modal-body').empty();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            $('.modal-body').empty();
        }
    }

    // Get param api key 
    var book_ids = [];
    var deleted = 6;
    var length = 0;
    var a_url = window.location.href;
    console.log(a_url);
    var b_url = new URL(a_url);
    var key = b_url.searchParams.get("key");
    console.log(key);

    // change title and page title name
    $('title').html("Recommendation Books by "+key);
    $('#left-title').html("Recommended Books <br> By " +key);

    //Serialize_form function
    var serialize_form = form => JSON.stringify(
    Array.from(new FormData(form).entries())
        .reduce((m, [ key, value ]) => Object.assign(m, { [key]: value }), {})
    );

    // get api data list
    $.ajax({
        url: "https://fullstack-book.ariefdfaltah.com/book/list?key="+key,
        success: function(data) {
            length = data.meta.data_count - deleted;
            for(var i = 0; i < length; i++){
                console.log(data.data[i]);
                var book = '<tr><td><h3>' + data.data[i].title + '</h3></td>' +
                        '<td><h3 class="text-center">' + data.data[i].category + '</h3></td>' +
                        '<td><h3 class="text-center"> <a class="fa fa-eye action detailBtn" id="' + data.data[i].id + '"></a> | <a class="fa fa-trash action delBtn" id="' + data.data[i].id + '"></a> </h3></td></tr>';
                    $('#booklist-header').after(book);
                }
                //detail function on click
                $('a.detailBtn').on('click', function(){
                    console.log($(this).attr('id'));
                    console.log(key);
                    $.ajax({
                        url: "https://fullstack-book.ariefdfaltah.com/book/detail/" + $(this).attr('id') + "?key="+key,
                        success: function(data) {
                            console.log(data);
                            modal.style.display = "block";
                            console.log(data.data.title);
                            $('.modal-header-txt').html(data.data.title);
                            var contentModal = '<h4>'+ data.data.description +'</h4>'
                            $('.modal-body').append(contentModal);
                        }
                });
                console.log("masuk");
                //delete function
                $('a.delBtn').on('click', function(){
                    console.log($(this).attr('id'));
                    console.log(key);
                    $.ajax({
                        url: "https://fullstack-book.ariefdfaltah.com/book/delete/" + $(this).attr('id') + "?key="+key,
                        success: function(data) {
                            console.log(data);
                            alert("Delete" + data.message);
                            location.reload();
                        }
                    });
                });
            });
        }
    });               
})