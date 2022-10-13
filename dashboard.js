const photoForm = document.getElementById('profile-photo-form');
const thumbnail = document.getElementById('profile-photo-thumbnail');
const personalInfoEditDiv = jQuery("#personal-info-edit-div");
const personalInfoDiv = jQuery("#personal-info-div");
const specialtiesSubmitButton = jQuery("#specialties-submit-button");
const modalitiesSubmitButton = jQuery("#modalities-submit-button");
const personalInfoEditButton = jQuery("#personal-info-edit-button");
const personalInfoSaveButton = jQuery("#personal-info-save-button");
const fnameField = jQuery("#first-name-edit-field");   
const lnameField = jQuery("#last-name-edit-field");
const descriptionField = jQuery("#description-edit-field");
let id, slug, fname, lname, description, specialties, modalities;   

window.onload = function() {
  if(localStorage.authToken == null){
    console.log('not authorized');
    //location.href="/sign-in";
  } else {
    console.log('authorized');
    getUserID().then(response => loadUser(response));
  }
}

console.log('test');

function loadUser(id) {
  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/user/"+id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.authToken
    }
  })
  .then(response => response.json())
  .then(data => {
console.log(data)
// User data 
id = data.user.id;
slug = data.user.slug;
fname = data.user.first_name;
lname = data.user.last_name;
description = data.user.description;
specialties = data.user.specialties_id;
modalities = data.user.modalities_id;   

fnameField.val(fname);      
lnameField.val(lname);
descriptionField.val(description);

setSpecialties(specialties);
setModalities(modalities);

})
  .catch((error) => {
    console.error('Error:', error);
  });
}


jQuery(personalInfoEditButton).click(function(){
  personalInfoDiv.hide();
  personalInfoEditDiv.show();
});

jQuery(personalInfoSaveButton).click(function(){
  const fnameField = jQuery("#first-name-edit-field").val();
  const lnameField = jQuery("#last-name-edit-field").val();
  const descriptionField = jQuery("#description-edit-field").val();        
  updatePersonal(id, fnameField, lnameField, descriptionField);
  personalInfoDiv.show();
  personalInfoEditDiv.hide();

  jQuery("#first-name").text(fnameField);      
  jQuery("#last-name").text(lnameField);
  jQuery("#description").text(descriptionField);
});


// Update user's profile photo
function updatePhoto(userID) {
  let photo = document.getElementById('profile-photo');
  var data = new FormData()
  data.append('profile_photo', photo.files[0])

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/update_profile_photo/"+userID, {
    method: "POST",
    body: data
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data.profile_photo.url);
    thumbnail.src = data.profile_photo.url;
    jQuery("#profile-photo").val('');

  })
  .catch((error) => {
    console.error('Error:', error);
  });        
}


photoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  updatePhoto(id);
});

jQuery(specialtiesSubmitButton).click(function(){
  updateSpecialties(id);
});

jQuery(modalitiesSubmitButton).click(function(){
  updateModalities(id);
});

// Check for changes in specialties
jQuery("#specialties-form .w-checkbox-input").change(function(){

  jQuery("#specialties-success-message").hide();
  let current = getCurrentSpecialties();
  if(current.sort().toString() != specialties.sort().toString()) {
    console.log("Selected: "+current.sort().toString()+"| Stored: "+specialties.sort().toString());
    jQuery("#specialties-submit-button .form-button").removeClass("disabled");
    jQuery("#specialties-submit-button .form-button").prop("disabled", false);
  } else {
    console.log("Selected: "+current.sort().toString()+" | Stored: "+specialties.sort().toString());
    jQuery("#specialties-submit-button .form-button").addClass("disabled");
    jQuery("#specialties-submit-button .form-button").prop("disabled", true);
  }
});

// Check for changes in modalities
jQuery("#modalities-form .w-checkbox-input").change(function(){
  jQuery("#modalities-success-message").hide();
  let current = getCurrentModalities();
  if(current.sort().toString() != modalities.sort().toString()) {
    jQuery("#modalities-submit-button .form-button").removeClass("disabled");
    jQuery("#modalities-submit-button .form-button").prop("disabled", false);
  } else {
    jQuery("#modalities-submit-button .form-button").addClass("disabled");
    jQuery("#modalities-submit-button .form-button").prop("disabled", true);
  }
});

// Update user's specialties in DB with current selection
function updateSpecialties(userID) {
  const spec = getCurrentSpecialties();
  console.log(spec);
  const data = {
    "specialties_id": spec,
    "user_id": userID
  };
  console.log(data);

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/update-user-specialties", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.authToken
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    specialties = data.specialties_id;
    jQuery("#specialties-submit-button button").addClass("disabled");
    jQuery("#specialties-submit-button button").prop("disabled", true);
    jQuery("#specialties-success-message").show().delay(5000).fadeOut();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Update user's modalities in DB with current selection
function updateModalities(userID) {
  const mods = getCurrentModalities();
  console.log(mods);
  const data = {
    "modalities_id": mods,
    "user_id": userID
  };
  console.log(data);

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/update-user-modalities", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.authToken
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    modalities = data.modalities_id;
    jQuery("#modalities-submit-button button").addClass("disabled");
    jQuery("#modalities-submit-button button").prop("disabled", true);
    jQuery("#modalities-success-message").show().delay(5000).fadeOut();;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


// Pass array of current specialties from DB and check all corrosponding checkboxes
function setSpecialties(list) {
  jQuery("#specialties-form input").each(function(){
    if( jQuery.inArray(parseFloat(jQuery(this).attr("data-specialty")), list) !== -1 ) {
      jQuery(this).prop("checked", true);
    }
  });
}

// Pass array of current specialties from DB and check all corrosponding checkboxes
function setModalities(list) {
  jQuery("#modalities-form input").each(function(){
    if( jQuery.inArray(parseFloat(jQuery(this).attr("data-modality")), list) !== -1 ) {
      jQuery(this).prop("checked", true);
    }
  });
}

// Get all currently checked modalities and return object to send to XANO db //
function getCurrentModalities() {
  var checkboxes = $("#modalities-form .w-checkbox-input");
  var modalities = [];
  checkboxes.each(function(){
    if( $(this).is(":checked")) {
      modalities.push(parseFloat($(this).attr("data-modality")));
    };
  })
  return modalities;
}


// Get all currently checked specialties and return object to send to XANO db //
function getCurrentSpecialties() {
  var checkboxes = $("#specialties-form .w-checkbox-input");
  var specialties = [];
  checkboxes.each(function(){
    if( $(this).is(":checked")) {
      specialties.push(parseFloat($(this).attr("data-specialty")));
    };
  })
  return specialties;
}


// Update user's personal info in Xano DB
function updatePersonal(userID, firstname, lastname, description) {

  const data = {
    "first_name": firstname,
    "last_name": lastname,
    "description": description,
    "user_id": userID
  };

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/user/"+userID, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.authToken
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function getUserID() {
  return fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/auth/me", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.authToken
    }
  })
  .then(response => response.json())
  .then(data => {
    return data.id
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
