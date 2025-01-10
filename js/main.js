// inputs
var productImg = document.getElementById('productImg');
var productName = document.getElementById('productName');
var productPrice = document.getElementById('productPrice');
var productDiscount = document.getElementById('productDiscount');
var productDescription = document.getElementById('productDescription');
var productCount = document.getElementById('productCount');

// btns
var addButton = document.getElementById('addButton');
var validationAlert = document.querySelectorAll('.alert');

// alerts
var imgValidation = document.getElementById('imgValidation')
var emptyValidation = document.getElementById('emptyValidation')
var added = document.getElementById('added')
var alreadyExist = document.getElementById('alreadyExist')
var updated = document.getElementById('updated')

// validation
var valiName = false;
var valiPrice = false;
var valiDisount = false;
var valiDescription = false;
var valiCount = false;

// to make sure if there's a storage to display or not
var productContainer;
if (localStorage.getItem("ourProducts") == null) {
    productContainer = [];
}
else {
    productContainer = JSON.parse(localStorage.getItem("ourProducts"));
    displayProducts()
}

// to track which product i'm updating to make sure the updated version goes back the same product
var nowProductIndex = null;

// submitting a new product
function addProduct() {
    removeAllvalidations()

    var product = {
        img: `img/${productImg.files[0]?.name}`,
        name: productName.value,
        price: productPrice.value,
        discount: productDiscount.value,
        description: productDescription.value,
        count: productCount.value
    };

    // Trigger validation again on all inputs before submitting
    productName.dispatchEvent(new Event('input'));
    productPrice.dispatchEvent(new Event('input'));
    productDiscount.dispatchEvent(new Event('input'));
    productDescription.dispatchEvent(new Event('input'));
    productCount.dispatchEvent(new Event('input'));

    if (productImg.files.length === 0) {
        imgValidationalert()
        return;
    }

    // Check if inputs are empty or invalid
    if (!product.name.trim() || !product.price.trim() || !product.description.trim() || !product.count.trim() || !valiName || !valiPrice || !valiDisount || !valiDescription || !valiCount) {
        emptyValidationalert()

        // Mark invalid fields
        if (!valiName) {
            productName.classList.add('is-invalid');
            validationAlert[0].classList.remove('d-none');
        }
        if (!valiPrice) {
            productPrice.classList.add('is-invalid');
            validationAlert[1].classList.remove('d-none');
        }
        if (product.discount.trim() && !valiDisount) {
            productDiscount.classList.add('is-invalid');
            validationAlert[2].classList.remove('d-none');
        }
        if (!valiDescription) {
            productDescription.classList.add('is-invalid');
            validationAlert[3].classList.remove('d-none');
        }
        if (!valiCount) {
            productCount.classList.add('is-invalid');
            validationAlert[4].classList.remove('d-none');
        }

        return;
    }

    // If inputs are valid, proceed with adding/updating the product
    if (nowProductIndex !== null) {
        //you're updating an existing product
        productContainer[nowProductIndex] = product;
        updatedalert()
        nowProductIndex = null;
        addButton.style.backgroundColor = '';
    } else {
        var vali = validateifexist(product);
        if (vali != -1) {
            productContainer[vali].count = +productContainer[vali].count + +product.count;
            alreadyExistalert()
        } else {
            // it's a new product yaaay
            productContainer.push(product);
            addedalert()
        }
    }

    localStorage.setItem("ourProducts", JSON.stringify(productContainer));
    displayProducts();
    clearInp();
    removeAllvalidations()
}

function displayProducts() {
    var productCard = "";
    for (var i = 0; i < productContainer.length; i++) {
        var discountMarkup = productContainer[i].discount >= 1
            ? `<div class="sale"><h1>${productContainer[i].discount}%</h1></div>`
            : "";

        var priceMarkup = productContainer[i].discount >= 1
            ? `<h5><del>${productContainer[i].price}$</del></h5>
            <h5>${(productContainer[i].price * (100 - productContainer[i].discount)) / 100}$</h5>`
            : `<h5>${productContainer[i].price}$</h5>`;

        var stockMarkup = productContainer[i].count < 1 ? `lowbrightness` : ``;
        var countMarkup = productContainer[i].count >= 1 ? `<h5 class="col-3 count">${productContainer[i].count}</h5>` :
            `<h5 class="col-3 outstock">out of stock</h5>`

        productCard += `
        <div class="card col-5 ${stockMarkup}">
            ${discountMarkup}
            <div class="img">
                <img src="${productContainer[i].img}"  />
            </div>
            <div class="row text">
                <div class="row col-12 head">
                    <div class="col-9 name">
                        <h3>${productContainer[i].name}</h3>
                    </div>
                    <div class="col-3 price">
                        ${priceMarkup}
                    </div>
                </div>
                <div class="col-12 description">
                    <p>${productContainer[i].description}</p>
                </div>
                <div class="actions row">
                    <button class="col-6 butn remove" onclick="deleteProduct(${i})"><i class="fa-solid fa-minus"></i></button>
                    ${countMarkup}
                    <button class="col-6 butn add" onclick="increaseProduct(${i})"><i class="fa-solid fa-plus"></i></button>
                    <button class="col-3 butn update" onclick="update(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </div>
        </div>`;
    }
    document.getElementById("cards").innerHTML = productCard;
}

// remove alerts & validations
function removeAllvalidations() {
    // removing the is-valid
    productName.classList.remove('is-valid');
    productPrice.classList.remove('is-valid');
    productDiscount.classList.remove('is-valid');
    productDescription.classList.remove('is-valid');
    productCount.classList.remove('is-valid');
    // removing the invalid
    productName.classList.remove('is-invalid');
    productPrice.classList.remove('is-invalid');
    productDiscount.classList.remove('is-invalid');
    productDescription.classList.remove('is-invalid');
    productCount.classList.remove('is-invalid');
    // removing alerts
    validationAlert[0].classList.add('d-none');
    validationAlert[1].classList.add('d-none');
    validationAlert[2].classList.add('d-none');
    validationAlert[3].classList.add('d-none');
    validationAlert[4].classList.add('d-none');
}

// validation functions
function validateifexist(product) {
    for (var i = 0; i < productContainer.length; i++) {
        if (product.img === productContainer[i].img
            && product.name === productContainer[i].name
            && product.price === productContainer[i].price
            && product.description === productContainer[i].description
            && product.discount === productContainer[i].discount) {

            return i;
        }
    }
    return -1;
}

function clearInp() {
    productImg.value = '';
    productName.value = '';
    productPrice.value = '';
    productDiscount.value = '';
    productDescription.value = '';
    productCount.value = '';
}

// btns functions
function deleteAll() {
    productContainer.splice(0)
    localStorage.setItem("ourProducts", JSON.stringify(productContainer));
    displayProducts()
}

function deleteProduct(i) {

    if (productContainer[i].count > 0) {
        productContainer[i].count--;
    }

    localStorage.setItem("ourProducts", JSON.stringify(productContainer));
    displayProducts()
}

function increaseProduct(i) {
    productContainer[i].count++;
    localStorage.setItem("ourProducts", JSON.stringify(productContainer));
    displayProducts()
}

function update(i) {
    var product = productContainer[i];
    productName.value = product.name;
    productPrice.value = product.price;
    productDiscount.value = product.discount;
    productDescription.value = product.description;
    productCount.value = product.count;

    nowProductIndex = i;
    addButton.innerHTML = `<i class="fa-sharp fa-solid fa-check"></i>`;
    addButton.style.backgroundColor = '#f2ff00';
}

// search function
function searchProduct(term) {
    var productCard = ``;

    if (term.trim() === '') {
        displayProducts();
        return;
    } else {
        for (var i = 0; i < productContainer.length; i++) {

            if (productContainer[i].name.toLowerCase().includes(term.trim().toLowerCase())) {
                var discountMarkup = productContainer[i].discount >= 1
                    ? `<div class="sale"><h1>${productContainer[i].discount}%</h1></div>`
                    : "";

                var priceMarkup = productContainer[i].discount >= 1
                    ? `<h5><del>${productContainer[i].price}$</del></h5>
                    <h5>${(productContainer[i].price * (100 - productContainer[i].discount)) / 100}$</h5>`
                    : `<h5>${productContainer[i].price}$</h5>`;

                var stockMarkup = productContainer[i].count < 1 ? `lowbrightness` : ``;

                productCard += `
                <div class="card col-5 ${stockMarkup}">
                    ${discountMarkup}
                    <div class="img">
                        <img src="${productContainer[i].img}"  />
                    </div>
                    <div class="row text">
                        <div class="row col-12 head">
                            <div class="col-9 name">
                                <h3>${productContainer[i].name}</h3>
                            </div>
                            <div class="col-3 price">
                                ${priceMarkup}
                            </div>
                        </div>
                        <div class="col-12 description">
                            <p>${productContainer[i].description}</p>
                        </div>
                        <div class="actions row">
                            <button class="col-6 butn remove" onclick="deleteProduct(${i})"><i class="fa-solid fa-minus"></i></button>
                            <h5 class="col-3 count">${productContainer[i].count}</h5>
                            <button class="col-6 butn add" onclick="increaseProduct(${i})"><i class="fa-solid fa-plus"></i></button>
                            <button class="col-3 butn update" onclick="update(${i})"><i class="fa-solid fa-pen-to-square"></i></button>
                        </div>
                    </div>
                </div>`;
            }
        }
    }

    document.getElementById("cards").innerHTML = productCard;
}

// validation using regex
productName.addEventListener("input", function () {
    var validate = /^[A-Za-z0-9 \-]{5,20}$/;
    ;

    // Check if the input is empty
    if (productName.value.trim() === '') {
        productName.classList.remove('is-valid');
        productName.classList.add('is-invalid');
        validationAlert[0].classList.remove('d-none');
        valiName = false;
        return false;
    }


    if (validate.test(productName.value)) {
        productName.classList.add('is-valid');
        productName.classList.remove('is-invalid');
        validationAlert[0].classList.add('d-none');
        valiName = true;
    } else {
        productName.classList.remove('is-valid');
        productName.classList.add('is-invalid');
        validationAlert[0].classList.remove('d-none');
        valiName = false;
    }
});

productPrice.addEventListener("input", function () {
    var validate = /^[1-9]\d*(\.\d+)?$/;
    // Check if the input is empty
    if (productPrice.value.trim() === '') {
        productPrice.classList.remove('is-valid');
        productPrice.classList.add('is-invalid');
        validationAlert[1].classList.remove('d-none');
        valiPrice = false;
        return false;
    }
    if (validate.test(productPrice.value)) {
        productPrice.classList.add('is-valid');
        productPrice.classList.remove('is-invalid');
        validationAlert[1].classList.add('d-none');
        valiPrice = true;
    } else {
        productPrice.classList.remove('is-valid');
        productPrice.classList.add('is-invalid');
        validationAlert[1].classList.remove('d-none');
        return false;
    }
})

productDiscount.addEventListener("input", function () {
    var validate = /^(100|[1-9]?\d)(\.\d{1,2})?$|^$/;
    if (validate.test(productDiscount.value)) {
        productDiscount.classList.add('is-valid');
        productDiscount.classList.remove('is-invalid');
        validationAlert[2].classList.add('d-none');
        valiDisount = true;
    } else {
        productDiscount.classList.remove('is-valid');
        productDiscount.classList.add('is-invalid');
        validationAlert[2].classList.remove('d-none');
        return false;
    }
})

productDescription.addEventListener("input", function () {
    var validate = /^[A-Za-z0-9 \-]{5,100}$/;
    // Check if the input is empty
    if (productDescription.value.trim() === "") {
        productDescription.classList.remove('is-valid');
        productDescription.classList.add('is-invalid');
        validationAlert[3].classList.remove('d-none');
        valiDescription = false;
        return;
    }

    if (validate.test(productDescription.value)) {
        productDescription.classList.add('is-valid');
        productDescription.classList.remove('is-invalid');
        validationAlert[3].classList.add('d-none');
        valiDescription = true;
    } else {
        productDescription.classList.remove('is-valid');
        productDescription.classList.add('is-invalid');
        validationAlert[3].classList.remove('d-none');
        return false;
    }
})

productCount.addEventListener("input", function () {
    var validate = /^(10000|[1-9]\d{0,3}|[1-9]\d{0,2}\.\d+)$/;
    // Check if the input is empty
    if (productCount.value.trim() === "") {
        productCount.classList.remove('is-valid');
        productCount.classList.add('is-invalid');
        validationAlert[4].classList.remove('d-none');
        valiCount = false;
        return;
    }
    if (validate.test(productCount.value)) {
        productCount.classList.add('is-valid');
        productCount.classList.remove('is-invalid');
        validationAlert[4].classList.add('d-none');
        valiCount = true;
    } else {
        productCount.classList.remove('is-valid');
        productCount.classList.add('is-invalid');
        validationAlert[4].classList.remove('d-none');
        return false;
    }
})

// validation alerts
function imgValidationalert() {
    imgValidation.classList.remove('d-none');
    imgValidation.classList.add('opacityfade')

    let fadeinterval = setInterval(() => {
        imgValidation.classList.add('d-none');
        clearInterval(fadeinterval);
    }, 6000);
}
function emptyValidationalert() {
    emptyValidation.classList.remove('d-none');
    emptyValidation.classList.add('opacityfade')

    let fadeinterval = setInterval(() => {
        emptyValidation.classList.add('d-none');
        clearInterval(fadeinterval);
    }, 6000);
}
function addedalert() {
    added.classList.remove('d-none');
    added.classList.add('opacityfade')

    let fadeinterval = setInterval(() => {
        added.classList.add('d-none');
        clearInterval(fadeinterval);
    }, 6000);
}
function alreadyExistalert() {
    alreadyExist.classList.remove('d-none');
    alreadyExist.classList.add('opacityfade')

    let fadeinterval = setInterval(() => {
        alreadyExist.classList.add('d-none');
        clearInterval(fadeinterval);
    }, 6000);
}
function updatedalert() {
    updated.classList.remove('d-none');
    updated.classList.add('opacityfade')

    let fadeinterval = setInterval(() => {
        updated.classList.add('d-none');
        clearInterval(fadeinterval);
    }, 6000);
}