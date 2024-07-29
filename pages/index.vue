<script setup>
// import categoriesQuery from "../apollo/queries/category/category";
import NavBar from "../components/NavBar";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const objectValue = useControlsStore();
let code;
onMounted(async () => {
  const params = router.currentRoute.value.fullPath.split("?")[1];
  const id = String(params).split("-").slice(-1);
  const response = await fetch(`http://localhost:1337/api/saved-datas/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.data.attributes.uuid + "-" + data.data.id === params) {
        objectValue.objectValue = JSON.parse(data.data.attributes.content);
      }
      console.log("FFFFFFFFFFFFFFFFGGGGGGGGG", data.data);
    });
});
const controls = ref({
  cx: Number(50),
  cy: Number(50),
  r: Number(45),
  color: "#fafafa",
});

const settings = ref({
  steps: 1,
});

const { svgTemplates } = useSettingsStore();

const updateSteps = () => {
  let defaultStep = 0.5;
  if (settings.value.steps > 0) {
    settings.value.steps = settings.value.steps;
  } else {
    settings.value.steps = defaultStep;
  }
};

watch(
  () => controls.value.color,
  (newColor) => {
    controls.value.color = newColor;
  },
  { deep: true }
);

const query = gql`
  query {
    svgTemplates {
      data {
        id
        attributes {
          title
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
const { data } = await useAsyncQuery(query);
const svgTemplatesData = ref([]);
data.value.svgTemplates.data.map((temp, index) => {
  svgTemplatesData.value.push({
    title: temp.attributes.title,
    url: temp.attributes.image.data.attributes.url,
  });
});
svgTemplates.value = svgTemplatesData.value;
</script>

<template>
  <div>
    <NavBar />
    <!-- <div v-for="a in data">
      <NuxtLink :to="{ name: 'svg-id', params: { id: a.id } }"
        >{{ a.data.attributes.title }}
      </NuxtLink>
    </div> -->
    <main class="flex justify-between">
      <div class="flex" @mouseup="test">
        <ObjectCreation />
        <SVGBackground />
        <controlsGUI
          :controls="controls"
          :settings="settings"
          @updateControls="updateControls"
        />
      </div>
    </main>
  </div>
</template>
