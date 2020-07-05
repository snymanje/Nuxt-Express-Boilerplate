<template>
  <div id="app">
    <div class="shadow-lg md:w-2/3 lg:w-1/3 pb-4 bg-gray-100 m-auto mt-10">
      <div class="bg-gray-800 h-12">
        <h2 class="text-white text-center font-bold text-xl p-2">Log In</h2>
      </div>
      <form class="pt-4">
        <div class="google-login m-4">
          <a
            class="text-white bg-blue-500 text-center inline-block w-full rounded-sm h-10 pt-2 shadow-md font-medium border"
            href="#"
          >Log in with Facebook</a>
        </div>

        <div class="facebook-login m-4">
          <a
            class="text-gray-900 bg-white text-center inline-block w-full rounded-sm h-10 pt-2 shadow-md font-medium border"
            href="#"
          >Log in with google</a>
        </div>

        <div class="email-login m-4">
          <p class="text-center text-gray-700 mt-10 mb-1 font-medium text-lg">Or login with Email</p>
          <input
            class="text-gray-700 w-full rounded-sm h-10 pt-2 shadow-md font-medium outline-none focus:shadow-lg p-3"
            type="text"
            name="email"
            id="email"
            placeholder="Your Email"
          />
          <input
            class="text-gray-700 w-full rounded-sm h-10 pt-2 shadow-md font-medium mt-4 outline-none focus:shadow-lg p-3"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <div class="email-login mt-4" @click="login()">
            <a
              class="text-white bg-blue-400 text-center inline-block w-full rounded-sm h-10 pt-2 shadow-md font-medium"
              href="#"
            >Log in</a>
          </div>
          <div class="email-login mt-4" @click="getSecureInfo()">
            <a
              class="text-white bg-blue-400 text-center inline-block w-full rounded-sm h-10 pt-2 shadow-md font-medium"
              href="#"
            >Get Secure Info</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getSecureInfo() {
      fetch("http://localhost:5000/weather/", {
        method: "get",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNzE5YTU0MjJhNjEzM2Q5MDQzZGYyNSIsImlhdCI6MTU4NTQ3NzI3MiwiZXhwIjoxNTg1NTYzNjcyfQ.G_Poe3kO43ZI52JXMNnfwnczEy0QKWuZ99vLuD6o5Cs",
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          response.json().then(function(data) {
            console.log(data);
          });
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
    },
    login() {
      fetch("http://localhost:5000/auth/login", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email: "jean.snyman3@gamil.com",
          password: "helloworld12345"
        })
      })
        .then(function(response) {
          response.json().then(function(data) {
            console.log(data);
          });
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
    }
  }
};
</script>
