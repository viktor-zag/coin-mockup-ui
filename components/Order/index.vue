<template>
  <NavBar />
  <CreateOrderModal
    v-show="showModal"
    @close-modal="handleCloseModal"
    @save-design="alert(1)"
  />

  <div class="grid grid-cols-12" :style="{ height: 'calc(100vh - 70px)' }">
    <div class="bg-slate-700 col-span-2">
      <h1>My order</h1>
      <ul class="space-y-1">
        <li>
          <button class="bg-slate-400 w-full py-3" @click="handleAllOrder(0)">
            All Order
          </button>
        </li>
        <li>
          <button class="bg-slate-400 w-full py-3" @click="handleAllOrder(1)">
            Draft Order
          </button>
        </li>
        <li>
          <button class="bg-slate-400 w-full py-3" @click="handleAllOrder(2)">
            Open Order(Accepted)
          </button>
        </li>
        <li>
          <button class="bg-slate-400 w-full py-3" @click="handleAllOrder(3)">
            Paid Order(Completed)
          </button>
        </li>
      </ul>
    </div>
    <div class="bg-slate-500 col-span-10 p-3 space-y-3 space-x-2">
      <button class="bg-slate-700 p-2 rounded-md" @click="handleShowModal">
        Create Order
      </button>
      <div class="bg-slate-700 min-h-[90%] space-y-1 py-2 px-1">
        <div v-if="orderList.length > 0">
          <OrderComponent
            :orderItems="orderItem"
            v-for="orderItem in orderList"
            :key="orderItem"
          />
        </div>
        <div v-if="orderList.length === 0">Loading...</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
import NavBar from "../NavBar/index.vue";
import hashString from "../../utils/hashString.js";
import CreateOrderModal from "../createOrderModal/index.vue";
import OrderComponent from "../orderComponent.vue";
import { SQUARE_LOCATION_ID } from "../config/ngrok.js";
const orderState = ref(0);
const control = useControlsStore();
const orderList = ref([]);
const showModal = ref(false);

onMounted(async () => {
  await handleAllOrder(0);
});

function handleCloseModal() {
  showModal.value = false;
}
function handleShowModal() {
  showModal.value = true;
}
async function handleAllOrder(val) {
  orderState.value = val;
  let stateFilter;
  if (val === 0) stateFilter = ["OPEN", "DRAFT", "CANCELED", "COMPLETED"];
  else if (val === 1) stateFilter = ["DRAFT"];
  else if (val === 2) stateFilter = ["OPEN"];
  else if (val === 3) stateFilter = ["COMPLETED"];
  try {
    let customerId;
    await hashString(localStorage.getItem("userEmail")).then((hash) => {
      customerId = hash;
    });
    const response = await fetch(
      "http://localhost:1337/api/square/findByCustomerId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customerId,
          stateFilter: stateFilter,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    orderList.value = responseData.orders;
    console.log("RERERERERE", responseData.orders);
  } catch (err) {
    console.log("Error error");
  }
}
</script>
