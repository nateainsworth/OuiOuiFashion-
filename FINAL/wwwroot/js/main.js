// Selection of categories on the product pages of the admin panel
$('#category-select option').mousedown(function (e) {
    e.preventDefault();
    $(this).prop('selected', !$(this).prop('selected'));
    return false;
});

// Generates a random promocode
function generatePromoCode() {
    document.getElementById('input-name').value = makeid(12);
}

//used to create a mixture of characters to be used as a promocode
function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}


// functions to run after the page contents have loaded.
$(document).ready(function () {
	
    // Allowsing the chat box not to open the chat upon dragging it. If the chat box isn't being dragged then it will activate
    $('#comm-btn').bind('click', function () {
        if ($(this).data('dragging')) return;
        openChat();
    });
    
    // Set-up of the ability to drag the chat icon
    $("#comm-btn").draggable({
        scroll: false,
        start: function (event, ui) {
            $(this).data('dragging', true);
        },
        stop: function (event, ui) {
            setTimeout(function () {
                console.log("hi " + this);
                $(event.target).data('dragging', false);
            }, 1);
        }
    });
    // this stops the chat box from disapearing off the page due to scrolling
    $("#comm-btn").draggable({
        scroll: false
    })

    // setting up the date and time pickers for the admin panel when selecting promotion start dates
    if ($('#datetimepicker6').length > 0) {
        $('#datetimepicker6').datetimepicker();
        $('#datetimepicker7').datetimepicker();
    }
	
    // sorts out the product tags of each product on the admin product page
    var seperateTagSelector = document.querySelectorAll('input[id*=product-tags]');

    // get each product tags selector
    for (var i = 0; i < seperateTagSelector.length; i++) {

        var j = seperateTagSelector[i].id.lastIndexOf('-');
        var n = seperateTagSelector[i].id.substring(j + 1);

	    ProductTags('product-tags-' + n, false);

    }

    ProductTags('admin-product-tags', true);

});



// creates the interactive tags of products on the admin panel  Retrieving predefined values set-up within settings.

function ProductTags(tagsid, freeinput) {
    if ($('#predefined-tags').length > 0) {
        var productDefinedTags = document.getElementById("predefined-tags").value;
        productTags = productDefinedTags.split(',');


        var productTags = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: productTags
        });

        $('#' + tagsid).tagsinput({
            typeaheadjs: [{
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'productTags',
                source: productTags
            }],
            freeInput: freeinput,
            tagClass: 'badge',
            capitalize: function (item) {
                return item ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item;
            }
        });


        $('#' + tagsid).on("beforeItemAdd", function (e) {
            var name = e.item;
            var allow = true;
            $(this).prev().find(".tag").each(function (i, valor) {
                if ($(this).text().toLowerCase() == name.toString().toLowerCase()) {
                    allow = false;
                    return false;
                }
            })

            if (!allow) {
                console.log("repeat");
                e.cancel = true;
            }
        });
    }
}

// futher development oportunity - if we decide to implement the option to add more than one image to products within the admin panel
var imageUploadCount = 0;
window.AddImageUpload = AddImageUpload;
function AddImageUpload(input) {
    var reader = new FileReader();
    reader.onload = function (e) {

        var $image_upload = '               <div id="uploaded-image-' + imageUploadCount + '" class="img-column contains" onclick="RemoveUpload(' + imageUploadCount + ',1)">';
        $image_upload += '                 <img class="img-object" src="' + e.target.result + '" alt="...">';
        $image_upload += '                 <div class="delete-img-btn"><i class="fas fa-times"></i></div>';
        $image_upload += '                 <input id="new-image' + imageUploadCount + '" type="text" value="' + e.target.result + '" hidden>';
        $image_upload += '              </div>';

        $($image_upload).insertBefore($('.img-upload-btn'));

    };
    reader.readAsDataURL(input.files[0]);
    imageUploadCount++;
}

// the function that works with the adding or additional images above, to remove images that have been uploaded
function RemoveUpload(imageID, n) {
    //existing image
    if (n == 0) {
        $("#existing-image-" + imageID).remove();
        var $remove_image = '<input hidden type="text" id="removed-image-' + imageID + '" value="' + imageID + '"/>';
        //$("#image-upload").append($remove_image);
        $($remove_image).insertAfter($('#image-upload'));
    }
    // new upload
    if (n == 1) {
        $("#uploaded-image-" + imageID).remove();
    }

}

// used on product pages to open the product details
function OpenProductDetails(rowID) {
    if ($("#card-lrg-detail-" + rowID).hasClass("d-none")) {
        $("#search-rows").val(rowID)
        $("#refine-search").val('')
        $("#search-rows").keyup();
        $('#search-area').addClass('invisible');

        $("#data-row-" + rowID).toggleClass("col-xl-6");
        $("#card-sml-detail-" + rowID).addClass("d-none");
        $("#card-lrg-detail-" + rowID).removeClass("d-none");

    }
}

// used to close product details
window.closeProductDetails = closeProductDetails;
function closeProductDetails(rowID) {

    $('#summary-panel-' + rowID).removeClass('d-none');
    $('#search-area').removeClass('invisible');
    $('#expanded-panel-' + rowID).addClass('d-none');
    $('#data-header').removeClass('d-none');
    $("#data-row-" + rowID).toggleClass("col-xl-6");
    $("#search-rows").val('');
    $("#search-rows").keyup();
    $("#card-sml-detail-" + rowID).removeClass("d-none");
    $("#card-lrg-detail-" + rowID).addClass("d-none");
}

var sizeColAmount = 0;
var pid = "";
// this function generates a size column if the admin wants to add additional sizes when adding products
function AddSizeCol(n) {
    sizeColAmount++;
    var $size_type = '                            <div class="size-column" name="sizecol-' + sizeColAmount + '">';
    $size_type += '                              <select class="form-control" id="' + pid + 'sizecol-' + sizeColAmount + '-size" name="' + pid + 'sizecol-' + sizeColAmount + '-size">';
    $size_type += '                                <option value="6">6</option>';
    $size_type += '                                <option value="8">8</option>';
    $size_type += '                                <option value="10">10</option>';
    $size_type += '                                <option value="12">12</option>';
    $size_type += '                                <option value="14">14</option>';
    $size_type += '                                <option value="16">16</option>';
    $size_type += '                                <option value="18">18</option>';
    $size_type += '                                <option value="20">20</option>';
    $size_type += '                                <option value="22">22</option>';
    $size_type += '                                <option disabled><b>MENS SIZE</b></option>';
    $size_type += '                                <option value="XS">XS</option>';
    $size_type += '                                <option value="S">S</option>';
    $size_type += '                                <option value="M">M</option>';
    $size_type += '                                <option value="L">L</option>';
    $size_type += '                                <option value="XL">XL</option>';
    $size_type += '                                <option value="XXL">XXL</option>';
    $size_type += '                                <option disabled><b>EU SIZE</b></option>';
    $size_type += '                                <option value="35">35</option>';
    $size_type += '                                <option value="36">36</option>';
    $size_type += '                                <option value="37">37</option>';
    $size_type += '                                <option value="38">38</option>';
    $size_type += '                                <option value="39">39</option>';
    $size_type += '                                <option value="40">40</option>';
    $size_type += '                                <option value="41">41</option>';
    $size_type += '                                <option value="42">42</option>';
    $size_type += '                              </select>';
    $size_type += '                              <input class="size-input" name="' + pid + 'input-quantity-' + sizeColAmount + '" id="' + pid + 'input-quantity-' + sizeColAmount + '" type="text" value="1"/>';
    $size_type += '                            </div>';


    $($size_type).insertBefore($('.add-size-type'));

}

// this function generates a size column if the admin wants to add additional sizes when editing products
function AddSizeColEdit(n) {
    sizeColAmount++;
    var $size_type = '                            <div class="size-column" name="sizecol-' + sizeColAmount + '">';
    $size_type += '                              <select class="form-control" id="' + pid + 'sizecol-' + sizeColAmount + '-size" name="' + pid + 'sizecol-' + sizeColAmount + '-size">';
    $size_type += '                                <option value="6">6</option>';
    $size_type += '                                <option value="8">8</option>';
    $size_type += '                                <option value="10">10</option>';
    $size_type += '                                <option value="12">12</option>';
    $size_type += '                                <option value="14">14</option>';
    $size_type += '                                <option value="16">16</option>';
    $size_type += '                                <option value="18">18</option>';
    $size_type += '                                <option value="20">20</option>';
    $size_type += '                                <option value="22">22</option>';
    $size_type += '                                <option disabled><b>MENS SIZE</b></option>';
    $size_type += '                                <option value="XS">XS</option>';
    $size_type += '                                <option value="S">S</option>';
    $size_type += '                                <option value="M">M</option>';
    $size_type += '                                <option value="L">L</option>';
    $size_type += '                                <option value="XL">XL</option>';
    $size_type += '                                <option value="XXL">XXL</option>';
    $size_type += '                                <option disabled><b>EU SIZE</b></option>';
    $size_type += '                                <option value="35">35</option>';
    $size_type += '                                <option value="36">36</option>';
    $size_type += '                                <option value="37">37</option>';
    $size_type += '                                <option value="38">38</option>';
    $size_type += '                                <option value="39">39</option>';
    $size_type += '                                <option value="40">40</option>';
    $size_type += '                                <option value="41">41</option>';
    $size_type += '                                <option value="42">42</option>';
    $size_type += '                              </select>';
    $size_type += '                              <input class="size-input" name="' + pid + 'input-quantity-' + sizeColAmount + '" id="' + pid + 'input-quantity-' + sizeColAmount + '" type="text" value="0"/>';
    $size_type += '                            </div>';


    $($size_type).insertBefore($('.' + pid + '-add-size-type'));

}




// opens the file pannel for uploading images to the site.
function readURL(input) {
    var reader = new FileReader();
    reader.onload = function (e) {
        //document.getElementById("Img").setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
}

//toggles tabs on the settings panel
window.ToggleTabs = ToggleTabs;
function ToggleTabs(n, o, i) {
    const tab_1 = document.querySelector("#panel-tab-" + o + "-" + i);
    tab_1.classList.remove("active");
    const tab_2 = document.querySelector("#panel-tab-" + n + "-" + i);
    tab_2.classList.add("active");

    const panel_1 = document.querySelector("#tab-pane-" + o + "-" + i);
    panel_1.classList.remove("show", "active");
    const panel_2 = document.querySelector("#tab-pane-" + n + "-" + i);
    panel_2.classList.add("show", "active");

}

//toggles mens on the admin panel 
function ToggleMenu() {
   
    const element = document.querySelector("#admin-menu");
    element.classList.toggle("d-none");

    const element_two = document.querySelector("#admin-page");
    element_two.classList.toggle("d-none");

}

$(document).ready(function () {
    // Used to search on most of the admin pages cutting down the amount of results
    $("#search-rows").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        if (value.length == 0) {
            $('#refine-search').addClass('d-none');
        } else {
            $('#refine-search').removeClass('d-none');
        }
        var value2 = $("#refine-search").val().toLowerCase();
        $("#data-list li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 && $(this).text().toLowerCase().indexOf(value2) > -1)
        });
    });
});

$(document).ready(function () {

//checks if the URL has specific parameters, used on the user panel to refine results by a username
    if (window.location.href.indexOf("user") > -1) {

        var urlParams = new URLSearchParams(window.location.search);
        userParam = urlParams.get('user');

        $("#search-rows").val(userParam);
        $("#refine-search").val('');
        $("#search-rows").keyup();
        
    }
//checks if the URL has specific parameters, used on the orders panel to refine results by a Order number
    if (window.location.href.indexOf("user") > -1) {
        if (window.location.href.indexOf("order") > -1) {

            var urlParams = new URLSearchParams(window.location.search);
            userParam = urlParams.get('order');

            $("#search-rows").val(userParam);
            $("#refine-search").val('');
            $("#search-rows").keyup();

        }
        // used to refine the search on the admin panel after the search has been used
        $("#refine-search").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            var value2 = $("#search-rows").val().toLowerCase();
            $("#data-list li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 && $(this).text().toLowerCase().indexOf(value2) > -1)
            });
        });

        window.calculateprice = calculateprice;
        // used to calculate the price within the basket
        function calculateprice(id) {
            var quantity = parseFloat(document.getElementById("input-" + id).value, 1);
            var price = document.getElementById("current-price-" + id).innerHTML;
            document.getElementById("total-" + id).innerHTML = price * quantity;
            document.getElementById("mob-total-" + id).innerHTML = price * quantity;


            UpdateBasket();
        }
        // updates the basket when changes take place
        function UpdateBasket() {

            var orderTotal = 0;
            document.querySelectorAll('.item-total-main').forEach(function (element, index) {
                orderTotal = parseInt(orderTotal) + parseInt(element.innerHTML);
            });

            document.getElementById("order-total").innerHTML = orderTotal;
            var vat = 15;
            var vatAmount = orderTotal * (vat / 100);
            document.getElementById("vat-amount").innerHTML = vatAmount;
            document.getElementById("vat-total").innerHTML = orderTotal + vatAmount;
        }

        if ($('#basket-page').length > 0) {
            OnLoadBasket();
        }

        function OnLoadBasket() {
            document.querySelectorAll('.item-id').forEach(function (element, index) {
                calculateprice(element.innerHTML);
                console.log(element.id)
            });

            UpdateBasket();
        }
    }
});
	
// opens details on the pages within the admin panel where there are lists
window.OpenDetails = OpenDetails;
function OpenDetails(rowID) {
    $("#search-rows").val(rowID)
    $("#refine-search").val('')
    $("#search-rows").keyup();
    $('#summary-panel-' + rowID).addClass('d-none');
    $('#expanded-panel-' + rowID).removeClass('d-none');
    $('#search-area').addClass('invisible');
    $('#data-header').addClass('d-none');

}

// closes details on the pages within the admin panel where there are lists	
function closeDetails(rowID) {
    $('#summary-panel-' + rowID).removeClass('d-none');
    $('#search-area').removeClass('invisible');
    $('#expanded-panel-' + rowID).addClass('d-none');
    $('#data-header').removeClass('d-none');
    $("#search-rows").val('');
    $("#search-rows").keyup();

}





/* -------- admin settings page Start --------- */
// Upon selection of different categories on a list selection, changing the visual look of the line clicked
function loadNewCheckboxes() {
    var newCategoryCheckboxes = document.querySelectorAll('input[id^=new-cat]');

    // get all settings inputs and watch for keyup event
    for (var i = 0; i < newCategoryCheckboxes.length; i++) {
        newCategoryCheckboxes[i].addEventListener("change", function (event) {


            var j = this.id.lastIndexOf('-');
            var n = this.id.substring(j + 1);

            CategoryCheckChange(n, 1);
        })
    }
}



loadNewCheckboxes();

$(document).ready(function () {
    var allCategoryCheckboxes = document.querySelectorAll('input[id*=existing-cat]');

    // get all settings inputs and watch for keyup event
    for (var i = 0; i < allCategoryCheckboxes.length; i++) {
        allCategoryCheckboxes[i].addEventListener("change", function (event) {


            var j = this.id.lastIndexOf('-');
            var n = this.id.substring(j + 1);

            CategoryCheckChange(n, 0);
        })
    }

});

function CategoryCheckChange(n, i) {

    if (i == 0) {
        var element = document.getElementById("category-line-" + n);
        element.classList.toggle("checked");
    } else {
        var element = document.getElementById("category-new-line-" + n);
        element.classList.toggle("checked");
    }
}

var categoryNumber = 1;

// depreciated function for adding categories
function AddCategoryOLD() {
    const textArea = document.querySelector("#input-category");
    var newCategory = textArea.value;
    var newCategoryCaps = newCategory.substring(0, 1).toUpperCase() +
        newCategory.substring(1, newCategory.length);

    if (newCategory.length > 0) {
        var $category_create = '<div id="category-new-line-' + categoryNumber + '" class="category-line">';
        $category_create += '<label for="new-cat-' + categoryNumber + '"><p>' + newCategoryCaps + '</p><i class="fas fa-times"></i></label>';
        $category_create += '<input type="checkbox" class="category-check" id="new-cat-' + categoryNumber + '">';
        $category_create += '</div>';
        $('#category-select').append($category_create);
        // $( $category_create ).appendTo( '#category-select');
        // document.getElementById("category-select").appendChild(category_create);
        categoryNumber++;

        var element = document.getElementById("category-select");
        element.scrollTop = element.scrollHeight;

        liveAddCategory(newCategory.toString());
    }
}


$('#admin-settings-page .twitter-typeahead').addClass('sticky-top');


// toggling the visability of the filter box on the admin panel
function ToggleFilter() {
    const element = document.querySelector("#filter-menu");
    element.classList.toggle("d-none");
}

// the following functions working with dropdowns run the filtering of the shop page on the public facing side of the site
$(".def_op_size").click(function () {
    $(".dropdown_size ul").addClass("active");
});

$(".dropdown_size ul li").click(function () {
    var text = $(this).text();
    $(".def_op_size").text(text);
    $(".dropdown_size ul").removeClass("active");
});


$(".def_op_category").click(function () {
    $(".dropdown_category ul").addClass("active");
});

$(".dropdown_category ul li").click(function () {
    var text = $(this).text();
    $(".def_op_category").text(text);
    $(".dropdown_category ul").removeClass("active");
});


$(".def_op_color").click(function () {
    $(".dropdown_color ul").addClass("active");
});

$(".dropdown_color ul li").click(function () {
    var text = $(this).text();
    $(".def_op_color").text(text);
    $(".dropdown_color ul").removeClass("active");
});


$(".def_op_material").click(function () {
    $(".dropdown_material ul").addClass("active");
});

$(".dropdown_material ul li").click(function () {
    var text = $(this).text();
    $(".def_op_material").text(text);
    $(".dropdown_material ul").removeClass("active");
});

/* END OF SHOP */

/* START OF CHECKOUT PAGE */
	// toggles between the different sections of the billing page
window.ToggleCheckoutMenu = ToggleCheckoutMenu;
function ToggleCheckoutMenu(menu) {
    if (menu == "delivery-menu") {
        const element = document.querySelector("#delivery-menu");
        element.classList.remove("d-none");
        const element2 = document.querySelector("#payment-menu");
        element2.classList.add("d-none");
        const element3 = document.querySelector("#promotion-menu");
        element3.classList.add("d-none");
        const element4 = document.querySelector("#notes-menu");
        element4.classList.add("d-none");
    }
    if (menu == "payment-menu") {
        const element = document.querySelector("#delivery-menu");
        element.classList.add("d-none");
        const element2 = document.querySelector("#payment-menu");
        element2.classList.remove("d-none");
        const element3 = document.querySelector("#promotion-menu");
        element3.classList.add("d-none");
        const element4 = document.querySelector("#notes-menu");
        element4.classList.add("d-none");
    }
    if (menu == "promotion-menu") {
        const element = document.querySelector("#delivery-menu");
        element.classList.add("d-none");
        const element2 = document.querySelector("#payment-menu");
        element2.classList.add("d-none");
        const element3 = document.querySelector("#promotion-menu");
        element3.classList.remove("d-none");
        const element4 = document.querySelector("#notes-menu");
        element4.classList.add("d-none");

    }
    if (menu == "notes-menu") {
        const element = document.querySelector("#delivery-menu");
        element.classList.add("d-none");
        const element2 = document.querySelector("#payment-menu");
        element2.classList.add("d-none");
        const element3 = document.querySelector("#promotion-menu");
        element3.classList.add("d-none");
        const element4 = document.querySelector("#notes-menu");
        element4.classList.remove("d-none");
    }


}

// closes the covid notice on the shop page
function RemoveMessage() {
    const element = document.querySelector("#covid-notification");
    element.classList.toggle("d-none");
}

/* END OF CHECKOUT PAGE */
/* Analysis on the dashboard page setting up the grids */
var day1 = 0;
var day2 = 0;
var day3 = 0;
var day4 = 0;
var day5 = 0;
var day6 = 0;
var day7 = 0;

var day1Date = '00/00/00';
var day2Date = '00/00/00';
var day3Date = '00/00/00';
var day4Date = '00/00/00';
var day5Date = '00/00/00';
var day6Date = '00/00/00';
var day7Date = '00/00/00';

var newOrdersPercentage = 0;
var newUsersPercentage = 0;
var activeSessionsPercentage = 0;



$(document).ready(function () {

    if ($('#myChart').length > 0) {

        var ctx = document.getElementById('myChart').getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [day1Date, day2Date, day3Date, day4Date, day5Date, day6Date, day7Date],
                datasets: [{
                    label: 'Sales Value',
                    data: [day1, day2, day3, day4, day5, day6, day7],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });


        /* ---------- Start Dounut ------------- */
	    // secont graph displaying device type
        var ctx = document.getElementById("device-chart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["Desktop", "Mobile", "Tablet"],

                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                elements: {
                    arc: {
                        roundedCornersFor: 0
                    }
                },
                segmentShowStroke: false,
                responsive: true,
                maintainAspectRatio: true,
                legend: {
                    // display: true

                    labels: {
                        filter(legendItem, data) {
                            // only show 2nd dataset in legend
                            return legendItem.text.includes("Red");
                        }
                    }


                },
                tooltips: {
                    filter: function (tooltipItem, data) {
                        var label = data.labels[tooltipItem.index];
                        console.log(tooltipItem, data, label);
                        //alert(label);

                        /*if (label == "Yellow") {
                          return false;
                        } else {
                          return true;
                        }*/
                        return true;
                    },

                }
            }
        });
    }
    /* ---------- End Dounut ----------- */

// setup of the dashboard widgets these are circles on the top of each page in the admin panel
    if ($('#percentage-1').length > 0) {
        StatsPercent('percentage-1', newOrdersPercentage);
        StatsPercent('percentage-2', newUsersPercentage);
        StatsPercent('percentage-3', 19);
    }

    function StatsPercent(stat, percent) {
        if (percent < 0) {
            var path = $('#' + stat).get(0);
            var pathLen = path.getTotalLength();
            var adjustedLen = 100 + percent;
		// check if it's below -50% as the way the SVG circles fills will break
            if (percent < -50) {
                var adjustedLen2 = 100 - adjustedLen;
                path.setAttribute('stroke-dasharray', '0,' + adjustedLen + ',' + adjustedLen2 + ',' + pathLen);
            } else {
                path.setAttribute('stroke-dasharray', '0,' + adjustedLen + ',' + adjustedLen + ',' + pathLen);
            }
        } else {
            var path = $('#' + stat).get(0);
            var pathLen = path.getTotalLength();
            var adjustedLen = percent * pathLen / 100;
            path.setAttribute('stroke-dasharray', adjustedLen + ' ' + pathLen);
        }

        var parent_element = document.getElementById(stat + '-svg');

        // check if class exists and remove before setting correct class for the updated figures 
        CheckRemoveClass(parent_element, "color-red");
        CheckRemoveClass(parent_element, "color-amber");
        CheckRemoveClass(parent_element, "color-green");

        // changing the colour dependant on the statistic
        if (percent < 20 && percent > 0) {
            parent_element.classList.add("color-amber");
        }
        if (percent >= 20) {
            parent_element.classList.add("color-green");
        }
        if (percent < 0) {
            parent_element.classList.add("color-red");
        }
        if (percent == 0) {
            parent_element.classList.add("color-blue");
        }

        var text_element = document.getElementById(stat + '-text');

        text_element.innerHTML = percent + '%';

        if (parseInt(percent) > 0) {
            text_element.innerHTML = '+' + percent + '%';
        }


    }



    function CheckRemoveClass(elementName, className) {
        if (elementName.classList.contains(className)) {
            elementName.classList.remove(className);
        }


    }

});
// increment and decrement the quantities to add to the basket on the product pages
function lowerQuantity() {
    var currentquantity = document.getElementById("quantityvalue").value;
    if (currentquantity > 1) {
        currentquantity--;
    }
    // also sent quantity to the hub
    document.getElementById("quantityvalue").value = currentquantity;
}
function incrementquantity(amount) {
    var currentquantity = document.getElementById("quantityvalue").value;
    if (currentquantity < maxQuantity) { // the five is replaced with the actual quantity
        currentquantity++;
    }
    // also sent quantity to the hub
    document.getElementById("quantityvalue").value = currentquantity;
}




/* ----- shop page start ----- */


var categoryParam = '';

function ToggleFilter() {
    const element = document.querySelector("#filter-menu");
    element.classList.toggle("d-none");
}
/*
$(".def_op_size").click(function () {
    $(".dropdown_size ul").addClass("active");
});

$(".dropdown_size ul li").click(function () {
    var text = $(this).text();
    $(".def_op_size").text(text);
    $(".dropdown_size ul").removeClass("active");
});


$(".def_op_category").click(function () {
    $(".dropdown_category ul").addClass("active");
});

$(".dropdown_category ul li").click(function () {
    var text = $(this).text();
    $(".def_op_category").text(text);
    $(".dropdown_category ul").removeClass("active");
});


$(".def_op_color").click(function () {
    $(".dropdown_color ul").addClass("active");
});

$(".dropdown_color ul li").click(function () {
    var text = $(this).text();
    $(".def_op_color").text(text);
    $(".dropdown_color ul").removeClass("active");
});


$(".def_op_material").click(function () {
    $(".dropdown_material ul").addClass("active");
});

$(".dropdown_material ul li").click(function () {
    var text = $(this).text();
    $(".def_op_material").text(text);
    $(".dropdown_material ul").removeClass("active");
});

*/

$(document).ready(function () {
// further filtering of the shop page

    $("#product-search-rows").on("keyup", function () {
        $(".product-container").filter(function (index, element) {
            $(this).toggle(CheckTags(element.id, 0, 0));
        });
    });

    $("#size-filter").on("change", function () {
        $(".product-container").filter(function (index, element) {
            $(this).toggle(CheckTags(element.id, 0, 0));
        });
    });

    $("#category-filter").on("change", function () {
        $(".product-container").filter(function (index, element) {
            $(this).toggle(CheckTags(element.id, 0, 0));
        });
    });
    $("#colour-filter").on("change", function () {
        $(".product-container").filter(function (index, element) {
            $(this).toggle(CheckTags(element.id, 0, 0));
        });
    });

    $("#filter-sortby").on("change", function () {
        var selection = $("#filter-sortby").val().toLowerCase();
        if (selection == 'no filter') {
            RemoveOrder();

            $(".product-container").filter(function (index, element) {
                $(this).toggle(CheckTags(element.id, 0, 0));
            });
        }
        if (selection == 'new products') {
            $(".product-container").filter(function (index, element) {
                $(this).toggle(CheckTags(element.id, 1, 'new'));
            });
        }
        if (selection == 'sale products') {
            $(".product-container").filter(function (index, element) {
                $(this).toggle(CheckTags(element.id, 1, 'sale'));
            });
        }
        if (selection == 'low to high' || selection == 'high to low') {
            RemoveOrder();

            var productArray = [{}];

            $(".product-container").filter(function (index, element) {
                var j = element.id.lastIndexOf('-');
                var n = element.id.substring(j + 1);

                var productCost = parseInt($("#" + element.id + " #product-price-" + n).text());

                productArray.push({
                    "ID": n,
                    "Cost": productCost
                });

            });

            console.log(productArray);
// saving the order of the images do be assigned bootstrap classes reordering the products
            var newProductOrder = [];
            var inserted;

            for (var i = 0, ii = productArray.length; i < ii; i++) {
                inserted = false;
                for (var j = 0, jj = newProductOrder.length; j < jj; j++) {
                    if (productArray[i]["Cost"] < newProductOrder[j]["Cost"]) {
                        inserted = true;

                        newProductOrder.splice(j, 0, productArray[i]);
                        break;
                    }
                }

                if (!inserted)
                    newProductOrder.push(productArray[i])
            }

            console.log(newProductOrder);
        }
	    // reordering the products by low to high on the shop page
        if (selection == 'low to high') {

            for (var i = 1; i < newProductOrder.length; i++) {

                $('#product-cont-' + newProductOrder[i]["ID"]).removeClass('[class="order-"]');
                console.log("product-cont-" + newProductOrder[i]["ID"]);
                var element = document.getElementById("product-cont-" + newProductOrder[i]["ID"]);
                element.classList.toggle(("order-" + i));
            }
        }
// reordering the products by high to low on the shop page
        if (selection == 'high to low') {
            console.log('high to low called');
            for (var i = 1; i < newProductOrder.length; i++) {
                //$('#product-cont-' + newProductOrder[i]["ID"]).removeClass('[class="order-"]');

                console.log("product-cont-" + newProductOrder[i]["ID"]);
                var element = document.getElementById("product-cont-" + newProductOrder[i]["ID"]);
                var orderPlace = newProductOrder.length - i;
                element.classList.toggle(("order-" + orderPlace));
            }


        }

    });


// removing the order so a new filter can be used 
    var arrClasses = [];

    function RemoveOrder(id) {
        $("#product-rows div[class*='order-']").removeClass(function () { // Select the element divs which has class that starts with some-class-
            var className = this.className.match(/order-\d+/); //get a match to match the pattern some-class-somenumber and extract that classname
            if (className) {
                arrClasses.push(className[0]); //if it is the one then push it to array
                return className[0]; //return it for removal
            }
        });
    }


// display visible tags on products if certain tags have been assigned to them.
    function CheckTags(element, a, value5) {
        if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf('sale') > -1) {

            var featureTags = '<div class="feature-tag sale"><p>SALE</p></div>';
            $("#" + element).append(featureTags);
        }
        if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf('new') > -1) {

            var featureTags = '<div class="feature-tag new"><p>NEW</p></div>';
            $("#" + element).append(featureTags);
            //<div class="feature-tag new"><p>NEW</p></div>
        }
        if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf('featured') > -1) {

            var featureTags = '<div class="feature-tag feature"><p>POPULAR</p></div>';
            $("#" + element).append(featureTags);
            //<div class="feature-tag new"><p>NEW</p></div>
        }
        if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf('outofstock') > -1) {

            /*var featureTags = '<div class="feature-tag feature" style="background-color:#ff0024;"><p>OUT OF STOCK</p></div>';
            $("#" + element).append(featureTags);*/

            $("#" + element).addClass('stock-0');
            //<div class="feature-tag new"><p>NEW</p></div>
        }

        var TagValue = false;
        var value = $("#product-search-rows").val().toLowerCase();
        var value2 = $("#size-filter").val().toLowerCase();
        var value3 = $("#category-filter").val().toLowerCase();
        var value4 = $("#colour-filter").val().toLowerCase();

        if (value2 == 'all') {
            value2 = '';
        }
        if (value3 == 'all') {
            value3 = '';
        }
        if (value4 == 'all') {
            value4 = '';
        }

        if (a == 1) {

            if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value2) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value3) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value4) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(categoryParam) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value5) > -1) {
                TagValue = true;
            }
        } else {
            if ($("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value2) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value3) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(value4) > -1 && $("#" + element + " .product-tags-hidden").text().toLowerCase().indexOf(categoryParam) > -1) {
                TagValue = true;
            }
        }

        return TagValue;
    }
	// get the url if it has a category within it then filter the shop page accordingly.
    if (window.location.href.indexOf("category") > -1) {

        var urlParams = new URLSearchParams(window.location.search);
        categoryParam = urlParams.get('category');
    }

    $(".product-container").filter(function (index, element) {
        if ($('.main-index-page').length > 0) {
            $(".product-container").filter(function (index, element) {
                $(this).toggle(true);
            });
        } else {
            $(this).toggle(CheckTags(element.id));
        }
    });
	// add to the end of the URL on the shop page to filter by category used on the home page on the category buttons
    //&category=dresses

});




/* ------ shop page end ------- */

/* LOGIN PAGE */
	// toggles the forgotten password fields

function ToggleForgotten() {
    const element = document.querySelector("#main-header-panel-create-account");
    element.classList.toggle("d-none");
    const element2 = document.querySelector("#main-header-panel-create-account-reset-password");
    element2.classList.toggle("d-none");
}

/* END OF LOGIN PAGE */

/* User settings */

function menuSelection(id) {
    for (var i = 1; i < 5; i++) {
        document.getElementById(i).classList.remove('active');
    }
    document.getElementById(id).classList.add('active');
}

/* end of user settigns */

window.ActivatePassword = ActivatePassword;
function ActivatePassword() {


    var passwordFields = '<div class="col-12">';
    passwordFields += '  <div class="form-group">';
    passwordFields += '    <label for="UserEmail">Create Password</label>';
    passwordFields += '    <input type="Password" class="form-control" id="userpassword" name="UserPassword"   required>';
    passwordFields += '  </div>';
    passwordFields += '</div>';
    passwordFields += '<div class="col-12">';
    passwordFields += '  <div class="form-group">';
    passwordFields += '    <label for="UserEmail">Confirm Password</label>';
    passwordFields += '    <input type="Password" class="form-control" id="userpasswordconfirm" name="UserConfirmPassword"  required>';
    passwordFields += '  </div>';
    passwordFields += '</div>';

    if ($('#password-activate').is(":checked")) {
        $("#create-account-inputs").append(passwordFields);
    }
    else if ($('#password-activate').is(":not(:checked)")) {
        $("#create-account-inputs").empty();
    }
}

// displays errors alert and success messages
function hideAlert() {
    //document.getElementById('alert-box').style.visibility = 'hidden';
    var slideSource = document.getElementById('alert-box');
    slideSource.classList.toggle('fade');
}

function hideSuccess() {
    //document.getElementById('success-box').style.visibility = 'hidden';
    var slideSource = document.getElementById('success-box');
    slideSource.classList.toggle('fade');
}

function hideAcknowledge() {
    //document.getElementById('acknowledge-box').style.visibility = 'hidden';
    var slideSource = document.getElementById('acknowledge-box');
    slideSource.classList.toggle('fade');
}
