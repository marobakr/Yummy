/// <reference types="../@types/jquery" />
//^/*========== HTML ElEMENTS ========== */

const parent = document.querySelector('#alldata');
const details = document.getElementById('details');
const nameFormInput = document.getElementById('name');
const emailFormInput = document.getElementById('email');
const phoneFormInput = document.getElementById('phone');
const ageFormInput = document.getElementById('age');
const passwordFormInput = document.getElementById('password');
const repasswordFormInput = document.getElementById('repassword');
const valiName = document.getElementById('validation-name');
const valiEmail = document.getElementById('validation-email');
const valiPhone = document.getElementById('validation-phone');
const valiAge = document.getElementById('validation-age');
const valiPassword = document.getElementById('validation-password');
const valiRePassword = document.getElementById('validation-repassword');

//~/*========== EVENT ========== */
$('.open-side').on('click', () => {
  openNav();
});
$('.close-side').on('click', () => {
  closeNav();
});

$('#search').on('click', () => {
  $('#alldata').fadeOut(100);
  $('#details').fadeOut(100);

  $('#formsearch').removeClass('d-none');
  showFormSearch();
  $('#searchName').val('');
  $('#searFirstLetter').val('');
  setTimeout(closeNav, 280);
});

$('#categories').on('click', () => {
  listAllMealCApi();
  $('#formsearch').addClass('d-none');
});
$('#area').on('click', () => {
  $('#formsearch').addClass('d-none');
  ListBy('a');
});
$('#ingredients').on('click', () => {
  $('#formsearch').addClass('d-none');
  ListBy('i');
});

// * =============> GLOBAL FUNCTION  ===============>
baseUrlApi();
async function getIdDetails(id) {
  StartLoding();
  const api = await fetch(
    `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const response = await api.json();
  const responsForId = response.meals;
  displayDetails(responsForId);
  EndLoding();
}
function displayDetails(responsForId) {
  $('#formsearch').addClass('d-none');
  let recipes = [];
  let measures = [];
  let outPutOfDetails = responsForId
    .map((details) => {
      //^ /* ==== Distraction ====  */
      let {
        strArea,
        strMeal,
        strInstructions: discription,
        strMealThumb: image,
        strCategory,
        strTags,
        strYoutube,
        strSource,
      } = details;
      for (let i = 1; i < 20; i++) {
        recipes.push(`strIngredient${i}`);
        measures.push(`strMeasure${i}`);
      }
      return `<div class="item-meal">
            <div class="row">
              <div class="col-lg-4">
                <figure class="w-100 m-auto mb-0 rounded-3">
                  <img
                    class="w-100 rounded-3"
                    src=${image}
                    alt="${strMeal}"
                  />
                </figure>
                <h3 class="text-white">${strMeal}</h3>
              </div>
              <div class="col-lg-8 flex-grow-1 text-white">
                <h2>Instructions</h2>
                <p class="mb-3">
               ${discription}
                </p>
                <h3 class="mb-3">Area: <span>${strArea}</span></h3>
                <h3 class="mb-3">Category : <span>${strCategory}</span></h3>
                <h3 class="mb-3">Recipes:</h3>
                <ul class="d-flex align-items-center flex-wrap gap-3 px-0">
                   ${recipes
                     .map((recipe, index) => {
                       if (details[recipe] !== '')
                         return `<li class='alert alert-info  p-1'>${
                           details[recipe]
                         } ${details[`strMeasure${index + 1}`]}</li>`;
                     })
                     .join('')}
                </ul>
                <h3> Tags :</h3>
                <ul class="d-flex align-items-center flex-wrap gap-3 px-0">
                ${
                  strTags === null
                    ? ' '
                    : strTags
                        .split(',')
                        .map((tag) => {
                          return `<li class="alert alert-danger  p-1">${tag}</li>`;
                        })
                        .join('')
                }
                </ul>
                <div class="bnts">
                  <a href="${strSource}" target="_blank" class="btn btn-success">Source</a>
                  <a href="${strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
                </div>
              </div>
            </div>
          </div>`;
    })
    .join('');
  details.innerHTML = outPutOfDetails;

  $('#alldata').fadeOut(10, () => {
    fedInFedOut('details');
  });
}
function displayGlobalData(strCategory) {
  $('#details').fadeOut(200);
  let output = strCategory
    .map((category) => {
      let { strMealThumb: img, strMeal, idMeal } = category;
      return ` <div class="col-lg-3 col-md-6 item">
            <figure role="button"  onclick="getIdDetails(${idMeal})"
              class="w-100 mb-0 position-relative rounded-2 overflow-hidden"
            >
              <img
                class="w-100 rounded-2"
                src=${img}
                alt=${strMeal}
              />
              <div class="over-laye position-absolute">
                <div
                  class="innner h-100 d-flex justify-content-start align-items-center"
                >
                  <h2>${strMeal}</h2>
                </div>
              </div>
            </figure>
          </div>`;
    })
    .join('');
  parent.innerHTML = output;

  // ? =============> Fire Hover Animation Of Item ===============>
  $('#alldata figure').hover(
    function () {
      handlerIn(this);
    },
    function () {
      handlerOut(this);
    }
  );
}

// ? =============> START ASYNC FUNCTION  ===============>
async function baseUrlApi() {
  StartLoding();
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`
  );
  const respons = await api.json();
  const meals = respons.meals;
  displayGlobalData(meals);
  EndLoding();
}

async function filterBy(q, strCategory) {
  StartLoding();
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${q}=${strCategory}`
  );
  const response = await api.json();
  const meals = response.meals;
  displayGlobalData(meals);
  EndLoding();
}
async function listAllMealCApi() {
  StartLoding();

  const api = await fetch(
    'https://www.themealdb.com/api/json/v1/1/categories.php'
  );
  const response = await api.json();
  displayCategory(response.categories);
  EndLoding();
}
/* 
^GetBy AOrI:
  -A = first letter
  -I = Ingredients 
*/
async function ListBy(AOrI) {
  StartLoding();
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?${AOrI}=list`
  );
  const response = await api.json();
  const meals = response.meals;
  displayBy(meals, AOrI);
  $('#details').fadeOut(200);
  EndLoding();
}
/* 
^get Data by Q:
  - S => name 
  - A => firtst Letter
^get Data letterOrName:
  Data From INput
*/
async function searchApi(q = 's', letterOrName = 'a') {
  if (letterOrName != '') {
    StartLoding();
    const api = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?${q}=${letterOrName}`
    );
    const respons = await api.json();
    const meals = await respons.meals;
    if (meals !== null) {
      $('#alldata').fadeIn(100, () => {
        displayGlobalData(meals);
      });
    }
  }
  EndLoding();
}

//* /*========== FUNCTION ========== */

function openNav() {
  $('nav').animate({ left: `0` }, 500);
  $('.open-side').animate({ height: 'toggle' }, 500, () => {
    $('.close-side').animate({ height: 'toggle' });
  });
}
function closeNav() {
  let widthSize = $('.side-hidden').innerWidth();
  $('nav').animate({ left: `-${widthSize}` }, 500);
  $('.close-side').animate({ height: 'toggle' }, 500, () => {
    $('.open-side').animate({ height: 'toggle' });
  });
}
closeNav();

function showFormSearch() {
  // ----- Get Value Data From Usr Input -----
  $('#searchName').on('input', function () {
    let searchName = $(this).val().toLowerCase();
    searchApi('s', searchName);
  });
  $('#searFirstLetter').on('input', function () {
    let searchFirstLetter = $(this).val().toLowerCase();
    searchApi('f', searchFirstLetter);
  });
}
function displayCategory(response) {
  let output = response
    .map((category) => {
      let {
        strCategory,
        strCategoryDescription: disc,
        strCategoryThumb: img,
      } = category;
      return `<div  role="button"  onclick="filterBy('c','${strCategory}')" class="col-lg-3 col-md-6">
            <figure )"
              class="w-100 mb-0 position-relative rounded-2 overflow-hidden"
            >
              <img
                class="w-100 rounded-2"
                src=${img}
                alt=${strCategory}
              />
              <div class="over-laye position-absolute">
                <div
                  class="innner h-100 text-center "
                >
                  <h2>${strCategory}</h2>
                  <p>${disc.split('').splice(0, 150).join('')}</p>
                </div>
              </div>
            </figure>
          </div>`;
    })
    .join('');
  fedInFedOut('alldata');
  $('#details').fadeOut(200);
  setTimeout(closeNav, 280);

  parent.innerHTML = output;
  // ? =============> Fire Hover Animation Of Item ===============>
  $('#alldata figure').hover(
    function () {
      handlerIn(this);
    },
    function () {
      handlerOut(this);
    }
  );
}
/* 
^display By response:
  - Area 
  - Ingredients
^displayBy AOrI:
  -A = first letter
  -I = Ingredients 
*/
function displayBy(response, AOrI) {
  let output = '';
  if (AOrI === 'a') {
    output = response
      .map((res) => {
        return `<div  role="button"  onclick="filterBy('${AOrI}','${res.strArea}')" class="col-md-3 text-white cursor-pointer">
                <div class="rounded-2 text-center ">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${res.strArea}</h3>
                </div>
        </div>`;
      })
      .join('');
  } else {
    output = response
      .splice(0, 20)
      .map((res) => {
        let { strDescription, strIngredient } = res;
        return `<div  role="button" onclick="filterBy('${AOrI}','${strIngredient}')" class="col-md-3 text-white cursor-pointer">
              <div class="rounded-2 text-center ">
                  <i class="fa-solid fa-drumstick-bite fa-4x mb-3"></i>
                  <h3 class="mb-3">${strIngredient}</h3>
                  <p class="mb-3">${
                    strDescription != null
                      ? strDescription.split('').splice(0, 100).join('')
                      : ''
                  }...</p/>
              </div>
      </div>`;
      })
      .join('');
  }
  parent.innerHTML = output;
  fedInFedOut('alldata');
  setTimeout(closeNav, 280);
}
// HandlerIn Animation SlideTop Layer
function handlerIn(e) {
  const selector = $(e).find('.over-laye').css({
    transform: 'translateY(0)',
  });
}
// HandlerIn Animation SlideBottom Layer
function handlerOut(e) {
  const selector = $(e).find('.over-laye').css({
    transform: 'translateY(110%)',
  });
}

// fedInFedOut Animation Show Meals
function fedInFedOut(elements) {
  $(`#${elements}`).fadeOut(300, () => {
    $(`#${elements}`).fadeIn(100, () => {
      $(`#${elements}`).fadeOut(100, () => {
        $(`#${elements}`).fadeIn(300, () => {});
      });
    });
  });
}

function StartLoding() {
  $('.loader').fadeIn(10, () => {
    $('#loding').fadeIn(10, () => {
      $('body').css('overflow', 'hidden');
    });
  });
}

function EndLoding() {
  $('.loader').fadeOut(100, () => {
    $('#loding').fadeOut(100, () => {
      $('body').css('overflow', 'auto');
    });
  });
}

//& /*========== GLOBAL VALIDAIONS FUNCTION ========== */
function checkValidationIsTrue(thisTarget) {
  thisTarget.classList.add('is-valid');
  thisTarget.classList.remove('is-invalid');
}
function checkValidationIsFalse(thisTarget) {
  thisTarget.classList.remove('is-valid');
  thisTarget.classList.add('is-invalid');
}

//~ Name Validation
$(nameFormInput).on('input', function (e) {
  validationName(e.target.value, this);
});
function validationName(value, thisTarget) {
  var regx = /^[a-zA-Z\s]+$/;
  if (regx.test(value)) {
    checkValidationIsTrue(thisTarget);
    valiName.classList.add('d-none');
    return true;
  } else {
    checkValidationIsTrue(thisTarget);
    valiName.classList.remove('d-none');
    return false;
  }
}

//~ Email Validation
$(emailFormInput).on('input', function (e) {
  validationEmail(e.target.value, this);
});
function validationEmail(value, thisTarget) {
  var regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (regx.test(value)) {
    checkValidationIsTrue(thisTarget);
    valiEmail.classList.add('d-none');
    return true;
  } else {
    checkValidationIsFalse(thisTarget);
    valiEmail.classList.remove('d-none');
    return false;
  }
}

//~ Phone Validation
$(phoneFormInput).on('input', function (e) {
  validationPhone(e.target.value, this);
});
function validationPhone(value, thisTarget) {
  var regx = /^(\+20|0)?1[0-9]{9}$/;
  if (regx.test(value)) {
    checkValidationIsTrue(thisTarget);
    valiPhone.classList.add('d-none');
    return true;
  } else {
    checkValidationIsFalse(thisTarget);
    valiPhone.classList.remove('d-none');
    return false;
  }
}

//~ Age Validation
$(ageFormInput).on('input', function (e) {
  validationAge(e.target.value, this);
});
function validationAge(value, thisTarget) {
  if (value != '') {
    checkValidationIsTrue(thisTarget);
    valiAge.classList.add('d-none');
    return true;
  } else {
    checkValidationIsFalse(thisTarget);
    valiAge.classList.remove('d-none');
    return false;
  }
}

//~ Password Validation
$(passwordFormInput).on('input', function (e) {
  validationPassword(e.target.value, this);
  console.log(e.target.value);
});
function validationPassword(value, thisTarget) {
  let regx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (regx.test(value)) {
    checkValidationIsTrue(thisTarget);
    valiPassword.classList.add('d-none');
    return true;
  } else {
    checkValidationIsFalse(thisTarget);
    valiPassword.classList.remove('d-none');
    return false;
  }
}

//~ RePassword Validation
$(repasswordFormInput).on('input', function (e) {
  validationRePassword(e.target.value, this);
  console.log(e.target.value);
});
function validationRePassword(value, thisTarget) {
  if (passwordFormInput.value === value) {
    checkValidationIsTrue(thisTarget);
    valiPassword.classList.add('d-none');
    return true;
  } else {
    checkValidationIsFalse(thisTarget);
    valiPassword.classList.remove('d-none');
    return false;
  }
}
