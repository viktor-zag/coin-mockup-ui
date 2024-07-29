<script setup>
import { defineEmits } from "vue";
import { v4 as uuidv4 } from "uuid";
import { SQUARE_LOCATION_ID } from "../config/ngrok.js";
import hashString from "../../utils/hashString.js";
import { quantity, basePrice } from "../config/mock.js";
const emit = defineEmits(["save-design"]);
const orderName = ref("");
const orderDescription = ref("");
const orderPayment = ref(0);
const orderSize = ref(1.5);
const orderQuantity = ref(50);
const control = useControlsStore();
const orderData = ref({});
const uuid = uuidv4();
const userEmail = ref("");
function handleNameChange(e) {
  orderName.value = e.target.value;
}
function handleDescriptionChange(e) {
  orderDescription.value = e.target.value;
}

function handlePaymentChange(e) {
  orderPayment.value = e.target.value;
}

function hanldeQuantityChange(e) {
  orderQuantity.value = e.target.value;
}

function handleSizeChange(e) {
  orderSize.value = e.target.value;
}

async function createOrder() {
  await hashString(localStorage.getItem("userEmail")).then((hash) => {
    userEmail.value = hash;
  });
  const note = {
    size: orderSize.value,
    description: orderDescription.value,
  };
  orderData.value = {
    idempotency_key: uuid,
    order: {
      location_id: SQUARE_LOCATION_ID,
      customer_id: userEmail.value,
      line_items: [
        {
          name: orderName.value,
          quantity: String(orderQuantity.value),
          note: JSON.stringify(note),
          base_price_money: {
            amount: Number(
              basePrice[quantity.indexOf(Number(orderQuantity.value))]
            ),
            currency: "CAD",
          },
        },
      ],
    },
  };
  try {
    const response = await fetch(
      "http://localhost:1337/api/square/createOrder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData.value),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const reponseData = await response.json();
  } catch (err) {
    console.log("Error error");
  }
}
</script>
<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal text-black px-3" @click.stop>
      <h1>Create Order</h1>
      OrderName:
      <input
        type="text"
        class="w-[150px] text-black border border-black"
        :value="orderName"
        @change="handleNameChange"
      />
      Size:<select
        class="w-[150px] text-black border border-black"
        :value="orderSize"
        @change="handleSizeChange"
      >
        <option value="1.5" selected>1.5"</option>
      </select>
      <!-- Price:<input
        type="number"
        class="w-[150px] text-black border border-black"
        :value="orderPayment"
        @change="handlePaymentChange"
      /> -->
      Quantity:
      <select
        class="w-[150px] text-black border border-black"
        :value="orderQuantity"
        @change="hanldeQuantityChange"
      >
        <option value="50" selected>50</option>
        <option value="100" selected>100</option>
        <option value="300" selected>300</option>
        <option value="500" selected>500</option>
        <option value="1000" selected>1000</option>
        <option value="2000" selected>2000</option>
      </select>
      <textarea
        class="w-[100%] h-[300px] text-black border border-black"
        :v-model="orderDescription"
        placeholder="Order Description"
        @change="handleDescriptionChange"
      ></textarea>
      <button class="bg-slate-700 p-2 rounded-md" @click="createOrder">
        Create Order
      </button>
    </div>
    <div class="close" @click="$emit('close-modal')">
      <div class="close-img">X</div>
    </div>
  </div>
</template>
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.modal {
  text-align: center;
  background-color: white;
  height: 550px;
  width: 800px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
  color: black;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  margin-top: 50px;
}
</style>
