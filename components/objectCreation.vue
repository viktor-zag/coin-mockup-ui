<script setup>
import { CircleIcon, BoxIcon, TextIcon, Pencil1Icon } from "@radix-icons/vue";
import { useRouter } from "vue-router";
const tabState = ref(0);
const { svgTemplates } = useSettingsStore();
const objectValue = useControlsStore();
const control = useControlsStore();
const selection = useSelectionsStore();

function selectTemplate(e) {
  tabState.value = 0;
}

function selectElements(e) {
  tabState.value = 1;
}

function selectLayers(e) {
  tabState.value = 2;
}
async function handleCreateSvg(url) {
  let paths = [];
  await fetch(`http://localhost:1337${url}`)
    .then((res) => res.text())
    .then((res) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(res, "image/svg+xml");
      const pathElements = svgDoc.getElementsByTagName("path");
      for (let i = 0; i < pathElements.length; i++) {
        control.createPiece(pathElements[i].outerHTML);
      }
    });
}
const router = useRouter();
async function selectSaves() {
  tabState.value = 3;
  const response = await fetch("http://localhost:1337/api/saved-datas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
      // control.savedData = res.json();
    })
    .then((data) => {
      console.log(
        "FFFFFFFFFFFFFFFFGGGGGGGGG",
        data.data[0].attributes.userName
      );
      objectValue.savedData = [];
      data.data.map((tempData, index) => {
        if (
          tempData.attributes.userName === localStorage.getItem("userEmail")
        ) {
          objectValue.savedData.push(tempData);
        }
      });
    });

  if (!response.ok) {
    throw new Error("Failed to post data");
  }
}
function NavigateParams(id, params) {
  console.log("FFFFFFFFFFFFDDDDDDD", id);
  router.push(`/?${encodeURIComponent(params.uuid)}-${id}`);
  const content = JSON.parse(params.content);
  console.log("FFFFFFFFFF", content);
  objectValue.objectValue = content;
}
</script>

<template>
  <div class="w-[350px] flex bg-slate-950">
    <div class="w-[55px] bg-slate-800">
      <button
        class="text-[12px] h-[70px] align-center items-center"
        @click="selectTemplate"
      >
        <img
          src="../assets/images/template.png"
          style="background-color: white; width: 50px"
        />
        Templates
      </button>
      <button class="text-[12px] h-[70px]" @click="selectElements">
        <img
          src="../assets/images/element-plus.svg"
          style="background-color: white; width: 50px"
        />
        Elements
      </button>
      <button class="text-[12px] h-[70px]" @click="selectLayers">
        <img
          src="../assets/images/layers.svg"
          style="background-color: white; width: 50px"
        />Layers
      </button>
      <br />
      <button class="text-[12px] h-[70px]" @click="selectSaves">
        <img
          src="../assets/images/load.png"
          style="background-color: white; width: 50px"
        />Loads
      </button>
    </div>
    <hr />
    <div
      v-if="tabState === 0"
      class="px-5 py-3 flex"
      style="user-select: none"
      draggable="false"
    >
      <span>
        <button
          @click="handleCreateSvg(indexTemplate.url)"
          class="bg-slate-600 w-full mr-7 mb-3 h-10 rounded-md"
          v-for="indexTemplate in svgTemplates.value"
          :key="indexTemplate"
          draggable="false"
        >
          <!-- <img
            v-bind:src="`http://localhost:1337${indexTemplate.url}`"
            draggable="false"
            :style="{
              width: '100px',
              height: '150px',
              userSelect: 'none',
              backgroundColor: '#a5a5a5',
            }"
          /> -->
          {{ indexTemplate.title }}
        </button>
        <br v-if="index % 2 === 1" />
      </span>
    </div>
    <div v-if="tabState === 1" class="space-x-2 flex px-5 py-3">
      <button
        @click="control.createCircle"
        class="border rounded bg-gray-900 h-[40px] w-[40px]"
      >
        <CircleIcon class="w-[30px] h-[30px] mx-auto" />
      </button>
      <button
        @click="control.createRect"
        class="border rounded bg-gray-900 h-[40px] w-[40px]"
      >
        <BoxIcon class="w-[30px] h-[30px] mx-auto" />
      </button>
      <button
        @click="control.createText"
        class="border rounded bg-gray-900 h-[40px] w-[40px]"
      >
        <TextIcon class="w-[30px] h-[30px] mx-auto" />
      </button>
      <button
        @click="
          () => {
            control.penState = 1;
            if (selection.objectSelected.id !== undefined) {
              selection.objectSelected.state.isActive = false;
            }
            control.createPen();
          }
        "
        class="border rounded bg-gray-900 h-[40px] w-[40px]"
      >
        <Pencil1Icon class="w-[30px] h-[30px] mx-auto" />
      </button>
    </div>
    <div v-if="tabState === 3">
      <ul>
        <li
          v-for="tempData in objectValue.savedData"
          :key="tempData"
          class="bg-gray-300 text-black"
        >
          <button
            @click="NavigateParams(tempData.id, tempData.attributes)"
            class="w-[295px]"
          >
            {{ tempData.attributes.name }}
          </button>
        </li>
      </ul>
    </div>
    <div
      v-if="tabState === 2"
      class="overflow-auto"
      :style="{ height: 'calc(100vh - 70px)' }"
    >
      <ul>
        <li
          v-for="tempObject in objectValue.objectValue.slice().reverse()"
          :key="tempObject"
          class="bg-gray-300 w-[295px] border-b-[1px] border-b-gray-700 h-[50px] pl-1 items-center flex"
        >
          <svg
            v-if="tempObject.type === 'piece'"
            :x="`${tempObject.control[0].value}`"
            :y="`${tempObject.control[1].value}`"
            width="40"
            height="40"
            v-html="`${tempObject.control[5].value}`"
          ></svg>

          <svg width="40" height="40" v-if="tempObject.type === 'rect'">
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              :fill="`${tempObject.control[4].value}`"
            />
          </svg>
          <svg width="40" height="40" v-if="tempObject.type === 'circle'">
            <circle
              cx="20"
              cy="20"
              r="20"
              :fill="`${tempObject.control[3].value}`"
            />
          </svg>
          <div
            width="40"
            height="40"
            v-if="tempObject.type === 'text'"
            class="text-black flex items-center"
          >
            <img src="../assets/images/t.png" width="35" height="35" />
            {{ tempObject.control[2].value }}
          </div>
          <div
            width="40"
            height="40"
            v-if="tempObject.type === 'pen'"
            class="text-black flex items-center"
          >
            <img src="../assets/images/pen.png" width="35" height="35" />
            Pen
          </div>
          <div
            width="40"
            height="40"
            v-if="tempObject.type === 'img'"
            class="text-black flex items-center"
          >
            <img
              :src="`${tempObject.control[7].value}`"
              width="35"
              height="35"
            />
            Image
          </div>
          <div class="text-black">Svg</div>
        </li>
      </ul>
    </div>
  </div>
</template>
