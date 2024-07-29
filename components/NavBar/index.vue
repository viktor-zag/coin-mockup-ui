<template>
  <nav
    class="flex justify-between px-5 justify-center items-center h-[70px] bg-gray-800"
  >
    <h1 class="text-3xl font-bold">
      Coin<span class="text-green-400">Mark</span>
    </h1>
    <button
      v-if="!isLoggedIn"
      class="font-bold hover:text-green-400 font-[Gambetta]"
      @click="loginWithGoogle"
    >
      LogIn with Google
    </button>
    <div class="flex space-x-4">
      <button
        v-if="isLoggedIn === true"
        class="font-bold hover:text-green-400 font-[Gambetta]"
      >
        {{ userEmail }}
      </button>
      <button
        class="font-bold hover:text-green-400 font-[Gambetta]"
        @click="handleHomePage"
      >
        MainPage
      </button>
      <button
        v-if="isLoggedIn"
        class="font-bold hover:text-green-400 font-[Gambetta]"
        @click="handleMyOrder"
      >
        My order
      </button>
      <button
        v-if="isLoggedIn"
        class="font-bold hover:text-green-400 font-[Gambetta]"
        @click="logOut"
      >
        LogOut
      </button>
    </div>
  </nav>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  clientId,
  clientSecret,
  redirectURI,
} from "../../components/config/ngrok";
const control = useControlsStore();
const googleClientId = clientId; // Replace with your actual Google Client ID
const redirectUri = redirectURI;
const router = useRouter();
const responseType = "code";
const isLoggedIn = ref(false);
const userEmail = ref("");
let code;
onMounted(async () => {
  code = localStorage.getItem("code");
  const expiryTime = localStorage.getItem("expiresIn");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (Number(new Date().getTime()) >= expiryTime) {
    const refreshedToken = await refreshAccessToken(refreshToken);
    if (refreshedToken) {
      localStorage.setItem("accessToken", refreshedToken);
    } else {
      console.error("Failed to refresh access Token");
    }
  }
  const infos = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${String(localStorage.getItem("accessToken"))}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (localStorage.getItem("accessToken")) {
        isLoggedIn.value = true;
      }
      userEmail.value = res.email;
      localStorage.setItem("userEmail", res.email);
    });
});
async function refreshAccessToken(refreshToken) {
  try {
    console.log("PPPPPPPPP");
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        access_type: "offline",
      }),
    });

    const data = await response.json();
    console.log("PPPPPPPPPPPPP", clientId, clientSecret, redirectURI);
    const accessToken1 = data.access_token;
    const refreshToken1 = data.refresh_token;
    const expiresIn1 = data.expires_in;
    if (accessToken1) {
      // Store or use the access token as needed
      localStorage.setItem("accessToken", accessToken1);
      localStorage.setItem(
        "expiresIn",
        new Date().getTime() + expiresIn1 * 1000
      );
      return data.access_token;
      // Redirect or navigate to another page
    } else {
      console.error("Access token not received");
    }
  } catch (error) {}
}
const loginWithGoogle = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=${responseType}&scope=openid%20profile%20email&access_type=offline`;

  window.location.href = authUrl;
};

const logOut = async () => {
  const params = new URLSearchParams();
  params.append("token", localStorage.getItem("accessToken"));
  const delresponse = await fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (delresponse.ok) {
    localStorage.removeItem("accessToken");
    console.log("Access token revoked successfully");
  } else {
    console.error("Failed to revoke access token:", response.status);
  }
};
function handleMyOrder() {
  router.push("/myorder");
}
function handleHomePage() {
  router.push("/");
}
</script>
