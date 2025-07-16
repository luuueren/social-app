// const baseUrl = 'https://tarmeezacademy.com/api/v1'
let currentPage = 1;
let lastPage = 1;

// INFINITE SCROLL
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
// INFINITE SCROLL

setupUI();

getPosts();

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios
    .get(`${baseUrl}/posts?page=${page}`)
    .then(function (response) {
      toggleLoader(false);
      // handle success
      // console.log("Last page from API:", response.data.meta.last_page);
      let posts = response.data.data;
      lastPage = response.data.meta.last_page;

      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

      for (post of posts) {
        // show or hide edit button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = "";

        if (isMyPost) {
          editBtnContent = `
                        <button class="btn btn-danger" style = "float: right;margin-left:5px;" onclick = 'deletePostBtnClicked("${encodeURIComponent(
                          JSON.stringify(post)
                        )}")'>delete</button>
                        <button class="btn btn-secondary" style="float: right;" onclick='editPostBtnClicked("${encodeURIComponent(
                          JSON.stringify(post)
                        )}")'>edit</button>
                        `;
        }

        let content = `
                    <div class="card">
                        <div class="card-header">
                            <span onclick="userClicked(${post.author.id})" style="cursor:pointer;" >
                            <img src="${post.author.profile_image}" alt=""
                                style="width: 50px;height: 50px;" class="rounded-circle border border-2 mt-1 mx-1">
                            <span style="font-weight: bold;">${post.author.username}</span>
                            </span>  
                            
                            ${editBtnContent}

                        </div>
                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">
                            <img src="${post.image}" class="w-100" alt="">
                            <h6 class="mt-2" style="color: rgb(117, 117, 117);">${post.created_at}</h6>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                                <span>(${post.comments_count}) comment</span>
                            </div>
                        </div>
                    </div>
                `;
        document.getElementById("posts").innerHTML += content;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

// function loginBtnClicked() {
//   let username = document.getElementById("username-input").value;
//   let password = document.getElementById("password-input").value;

//   const params = {
//     username: username,
//     password: password,
//   };

//   axios.post(`${baseUrl}/login`, params).then(function (response) {
//     const token = response.data.token;
//     const user = response.data.user;

//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));

//     const modal = document.getElementById("login-modal");
//     const modalInstance = bootstrap.Modal.getInstance(modal);
//     modalInstance.hide();

//     showAlert("logging succesfully", "success");
//     setupUI();
//   });
// }

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
    });
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("logout successfully", "success");
  setupUI();
}

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

function addBtnClicked() {
  document.getElementById("post-id-input").value = "";
  document.getElementById("title-input").value = "";
  document.getElementById("body-input").value = "";

  document.getElementById("post-modal-submit-btn").innerHTML = "Create";

  document.getElementById("post-modal-title").innerHTML = "create a new post";
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

// function addBtnClicked() {
//     document.getElementById("post-id-input").value = ""
//     document.getElementById("title-input").value = ""
//     document.getElementById("body-input").value = ""

//     document.getElementById("post-modal-submit-btn").innerHTML = "Create"

//     document.getElementById("post-modal-title").innerHTML = "create a new post"
//     let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
//     postModal.toggle();
// }

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}
