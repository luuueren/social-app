const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUI() {
  const token = localStorage.getItem("token");

  const loginDiv = document.getElementById("loging-btn");
  const logoutDiv = document.getElementById("logout-btn");
  const addBtnDiv = document.getElementById("add-btn");

  if (token == null) {
    if (addBtnDiv != null) {
      addBtnDiv.style.setProperty("display", "none", "important");
    }

    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addBtnDiv != null) {
      addBtnDiv.style.setProperty("display", "flex", "important");
    }

    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");

    let user = getCurrentUser();
    document.getElementById("username-user").innerHTML = user.username;
    document.getElementById("image-user").src = user.profile_image;
  }
}

// ====== REQUEST FUNCTIONS =====

function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  let title = document.getElementById("title-input").value;
  let body = document.getElementById("body-input").value;
  let image = document.getElementById("image-input").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  // const params = {
  //     "body": body,
  //     "title": title
  // }

  let url = "";

  const token = localStorage.getItem("token");

  const header = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }

  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: header,
    })
    .then(function (response) {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("create post succesfully", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
      getPosts();
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function postClicked(postID) {
  window.location = `postDetails.html?postID=${postID}`;
}

function editPostBtnClicked(postObject) {
  let decoded = decodeURIComponent(postObject);
  let post = JSON.parse(decoded);

  document.getElementById("post-id-input").value = post.id;
  document.getElementById("title-input").value = post.title;
  document.getElementById("body-input").value = post.body;

  document.getElementById("post-modal-submit-btn").innerHTML = "update";

  document.getElementById("post-modal-title").innerHTML = "edit post";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function deletePostBtnClicked(postObject) {
  let decoded = decodeURIComponent(postObject);
  let post = JSON.parse(decoded);
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  let postId = document.getElementById("delete-post-id-input").value;
  const token = localStorage.getItem("token");

  const header = {
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(`${baseUrl}/posts/${postId}`, {
      headers: header,
    })
    .then(function (response) {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("post was deleted succesfully", "success");
      getPosts();
    })
    .catch((error) => {
      const errorMessage = error.response.data.message;
      showAlert(errorMessage, "danger");
    });
}

// AUTH FUNCTIONS
function loginBtnClicked() {
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };

  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, params)
    .then(function (response) {
      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("logging succesfully", "success");
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function registerBtnClicked() {
  let username = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;
  let name = document.getElementById("register-name-input").value;
  let image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", image);

  const header = {
    "Content-Type": "multipart/form-data",
  };

  // const params = {
  //     "username": username,
  //     "password": password,
  //     "name": name
  // }

  toggleLoader(true);
  axios
    .post(`${baseUrl}/register`, formData, {
      headers: header,
    })
    .then(function (response) {
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showAlert("register succesfully", "success");
      setupUI();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logout successfully", "success");
  setupUI();
}
// AUTH FUNCTIONS

function showAlert(msg, typeAlert = "success") {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert" style="position: fixed; z-index: 100; width: 100%;">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(msg, typeAlert);

  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance(`#${typeAlert}-alert`);
    alert.close();
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
