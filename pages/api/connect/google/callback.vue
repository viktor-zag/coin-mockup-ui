<template>
  <div class="text-black">
    <h1>Google OAuth Callback</h1>
    <p v-if="code">Authorization Code: {{ code }}</p>
    <p v-else>No authorization code found.</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  clientId,
  clientSecret,
  redirectURI,
} from "../../../../components/config/ngrok.js";
const objectValue = useControlsStore();
const router = useRouter();

onMounted(async () => {
  const { code } = router.currentRoute.value.query;
  localStorage.setItem("code", code);
  if (code) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get("code");
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          grant_type: "authorization_code",
          redirect_uri: redirectURI,
          access_type: "offline",
        }),
      });

      const data = await response.json();
      console.log("Token Response:", data);

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresIn = data.expires_in;

      if (accessToken) {
        // Store or use the access token as needed
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem(
          "expiresIn",
          new Date().getTime() + expiresIn * 1000
        );
        router.push("/");
        // Redirect or navigate to another page
      } else {
        console.error("Access token not received");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  } else {
    console.error("Authorization code not found");
  }
});
</script>
