$('.lock-scroll').on('click', toggleScrolling);
function toggleScrolling() {
  $('html').toggleClass('no-scroll');
}

const spinner = document.getElementById("spinner-embed");
var r = $('#signUpSlider .w-slider-arrow-right');
var l = $('#signUpSlider .w-slider-arrow-left');

$("#checkout-cancel").on('click', function(){
  l.trigger('tap');
});


$("#create-user-button").on('click', function(){
    $(this).children('.button-text').css('display','none');
    spinner.style.display = "block";
    setTimeout(function() {
      createPendingUser()
    }, 1500);
});

function createPendingUser() {

    const data = {
      "first_name": jQuery("#first-name").val(),
      "last_name": jQuery("#last-name").val(),
      "email": jQuery("#email").val(),
      "password": jQuery("#password").val()
    };

    fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/auth/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      document.cookie = 'w-c---1l3814vyf=' + data.user + '; max-age=3600; path=/';
      console.log('Success:', data);
      spinner.style.display = "none"
      $("#create-user-button").children('.button-text').css('display','block');
      r.trigger('tap');
    })
    .catch((error) => {
      console.error('Error:', error);
      spinner.style.display = "none"
      $("#create-user-button").children('.button-text').css('display','block');
    });
  }


function checkout() {

    let email = $("#email").val()
    
    const data = {
      "success_url": "https://wasw.webflow.io/dashboard",
      "cancel_url": "https://wasw.webflow.io/join",
      "line_items": [{
        "price": "price_1LbAE6JewUx5W1TOBP94gQjc",
        "quantity": 1
      }],
      "email": email
    }

    fetch("https://x8ki-letl-twmt.n7.xano.io/api:eLwAvJ1z/sessions", 
      {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
    .then(response => response.json())
    .then(data => {
      const redirectURL = data.url;
      console.log('Success:', data);
      window.location.href = redirectURL;
    })
    .catch((error) => {
      console.error('Error:', error);
    })
}
  
  
  jQuery('#stripe-checkout-btn').click(function() {
    checkout();
  });