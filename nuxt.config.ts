// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/fonts",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-svgo",
    "@nuxtjs/apollo",
    "nuxt-file-storage",
  ],

  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://localhost:1337/graphql",
      },
    },
  },
  fileStorage: {
    mount: "./assets/images",
  },
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        // Square Web Payments SDK
        { src: "https://sandbox.web.squarecdn.com/v1/square.js" },
      ],
    },
  },
});
