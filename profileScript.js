setupUI();
getUser();
getPosts();

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}

function getUser() {
  const userId = getCurrentUserId();
  axios
    .get(`${baseUrl}/users/${userId}`)
    .then(function (response) {
      let user = response.data.data;
      document.getElementById("image-main-info").src = user.profile_image;
      document.getElementById("email-main-info").innerHTML = user.email;
      document.getElementById("username-main-info").innerHTML = user.username;
      document.getElementById("name-main-info").innerHTML = user.name;
      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;
      document.getElementById("name-posts").innerHTML = `${user.name}'s`;

      console.log(user);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}

function getPosts() {
  const userId = getCurrentUserId();
  axios
    .get(`${baseUrl}/users/${userId}/posts`)
    .then(function (response) {
      // handle success
      // console.log("Last page from API:", response.data.meta.last_page);
      let posts = response.data.data;
      document.getElementById("user-posts").innerHTML = "";

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
                            <img src="${post.author.profile_image}" alt=""
                                style="width: 50px;height: 50px;" class="rounded-circle border border-2 mt-1 mx-1">
                            <span style="font-weight: bold;">${post.author.username}</span>
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
        document.getElementById("user-posts").innerHTML += content;
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
