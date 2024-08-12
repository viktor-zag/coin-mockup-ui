<template>
  <nav
    class="flex justify-between px-5 justify-center items-center h-[70px] bg-gray-800"
  >
    <h1 class="text-3xl font-bold">
      Coin<span class="text-green-400">Mark</span>
    </h1>

    <div class="flex space-x-4">
      <button
        class="font-bold hover:text-green-400 font-[Gambetta]"
        @click="handleHomePage"
      >
        MainPage
      </button>
      <button
        v-if="!isLoggedIn"
        class="font-bold hover:text-green-400 font-[Gambetta]"
        @click="loginWithGoogle"
      >
        LogIn with Google
      </button>
      <DropdownMenuRoot v-model:open="toggleState" v-if="isLoggedIn">
        <DropdownMenuTrigger aria-label="Customise options">
          <AvatarRoot
            class="bg-pink-700 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle"
          >
            <AvatarFallback
              class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-pink-700 text-[15px] font-medium"
            >
              {{ userRealName[0] }}
            </AvatarFallback>
          </AvatarRoot>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent
            class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            :side-offset="5"
          >
            <DropdownMenuItem
              value="New Tab"
              class="group text-[16px] leading-none text-black rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-black data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              @click="handleMyOrder"
            >
              <button>My Order</button>
            </DropdownMenuItem>
            <DropdownMenuSeparator class="h-[1px] bg-gray-400 m-[5px]" />
            <DropdownMenuItem
              value="New Tab"
              class="group text-[16px] leading-none text-black rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-black data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
              @click="logOut"
            >
              <button>Log Out</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
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
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "radix-vue";
const control = useControlsStore();
const googleClientId = clientId; // Replace with your actual Google Client ID
const redirectUri = redirectURI;
const router = useRouter();
const userRealName = ref("");
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
      localStorage.setItem("name", res.name);
      userRealName.value = localStorage.getItem("name");
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
    localStorage.removeItem("code");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("name");
    isLoggedIn.value = false;
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
