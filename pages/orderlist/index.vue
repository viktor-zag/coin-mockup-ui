<template>
  <NavBar />
  <div
    class="bg-slate-700 text-[20px] space-y-28 pl-28 pt-10"
    :style="{ height: 'calc(100vh - 70px)' }"
  >
    <div class="flex space-x-10">
      <button
        class="bg-slate-500 rounded-md px-4 py-2"
        @click="handleGoOrderList"
      >
        Go to OrderList
      </button>
    </div>
    <div v-if="Object.keys(detailData).length === 0">Loading...</div>
    <div
      v-if="Object.keys(detailData).length !== 0"
      class="bg-slate-500 mr-32 px-10 py-10"
    >
      <div class="flex space-x-10">
        <div><span class="text-black">OrderId:</span>{{ detailData.id }}</div>
        <div>
          <span class="text-black">created at:</span>{{ detailData.created_at }}
        </div>
        <div>
          <span class="text-black">total amount:</span
          >{{ detailData.total_money?.amount }}
        </div>
        <div>
          <span class="text-black">currency:</span
          >{{ detailData.total_money?.currency }}
        </div>
        <div>
          <span class="text-black">version:</span>{{ detailData.version }}
        </div>
        <div><span class="text-black">state:</span>{{ detailData.state }}</div>
      </div>
      <br />
      <div class="flex space-x-10">
        <div>
          <span class="text-black">total discount amount:</span
          >{{ detailData.total_discount_money?.amount
          }}{{ detailData.total_discount_money?.currency }}
        </div>
        <div>
          <span class="text-black"> total tax amount:</span
          >{{ detailData.total_tax_money?.amount
          }}{{ detailData.total_tax_money?.currency }}
        </div>
        <div>
          <span class="text-black">total tip amount:</span
          >{{ detailData.total_tip_money?.amount
          }}{{ detailData.total_tip_money?.currency }}
        </div>
      </div>
      <br />
      <div v-for="(orderItem, index) in detailData.line_items" :key="orderItem">
        <div>item{{ index + 1 }}</div>
        <div class="flex space-x-10">
          <div><span class="text-black">name:</span>{{ orderItem.name }}</div>
          <div><span class="text-black">id:</span>{{ orderItem.uid }}</div>
          <div>
            <span class="text-black">total money:</span
            >{{ orderItem.total_money?.amount
            }}{{ orderItem.total_money?.currency }}
          </div>
        </div>
        <br />
        <div class="flex space-x-10">
          <div>
            <span class="text-black">base price money:</span
            >{{ orderItem.base_price_money?.amount
            }}{{ orderItem.base_price_money?.currency }}
          </div>
          <div>
            <span class="text-black">Quantity:</span>{{ orderItem.quantity }}
          </div>
          <div>
            <span class="text-black">gross sales money:</span
            >{{ orderItem.gross_sales_money?.amount
            }}{{ orderItem.gross_sales_money?.currency }}
          </div>
          <div>
            <span class="text-black">total discount money:</span
            >{{ orderItem.total_discount_money?.amount
            }}{{ orderItem.total_discount_money?.currency }}
          </div>
          <div>
            <span class="text-black">total tax money:</span
            >{{ orderItem.total_tax_money?.amount
            }}{{ orderItem.total_tax_money?.currency }}
          </div>
        </div>
        <br />
        <div class="flex space-x-10">
          <div>
            <span class="text-black">description:</span>{{ orderItem.note }}
          </div>
        </div>
      </div>
      <br />
      <div class="">
        <form @submit.prevent="handlePaymentMethodSubmission">
          <div v-if="loading">Payment Connecting...</div>
          <div id="card-container" class="w-[40%]" />
          <button class="bg-slate-700 rounded-md px-4 py-2">
            Pay {{ detailData.total_money?.amount
            }}{{ detailData.total_money?.currency }}
          </button>
        </form>
        <div v-if="paymentStatus" id="payment-status-container">
          {{ paymentStatus }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
import { ref, onMounted } from "vue";
import {
  SQUARE_APP_ID,
  SQUARE_LOCATION_ID,
} from "../../components/config/ngrok.js";
import { useRouter } from "vue-router";
const detailData = ref({});
const router = useRouter();
const appId = SQUARE_APP_ID;
let uuid;
let card;
let loading = ref(true);
let paymentStatus = ref("");

onMounted(async () => {
  const params = router.currentRoute.value.fullPath.split("?")[1];
  const response = await fetch(
    `http://localhost:1337/api/square/findOrderById`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: params,
      }),
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      detailData.value = res.order;
      console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", res.order);
    });
  loading.value = true;
  await initializePaymentForm();
  loading.value = false;
});

const initializePaymentForm = async () => {
  console.log("SQuare", Square);
  if (!Square) {
    throw new Error("Square.js failed to load properly");
  }
  const payments = Square.payments(appId, SQUARE_LOCATION_ID);
  try {
    card = await payments.card();
    await card.attach("#card-container");
  } catch (e) {
    console.error("Initializing Card failed", e);
    return;
  }
};
const tokenize = async (paymentMethod) => {
  const tokenResult = await paymentMethod.tokenize();
  if (tokenResult.status === "OK") {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
    }
    throw new Error(errorMessage);
  }
};

function handleGoOrderList() {
  router.push("/myorder");
}

const handlePaymentMethodSubmission = async () => {
  if (detailData.value.state === "OPEN") {
    uuid = uuidv4();
    paymentStatus.value = "";
    const token = await tokenize(card);
    const { data, error } = await useFetch(
      "http://localhost:1337/api/payment/create",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: {
          idempotency_key: uuid,
          locationId: SQUARE_LOCATION_ID,
          orderId: detailData.value.id,
          sourceId: token,
          amount_money: {
            amount: detailData.value.total_money?.amount, // Convert to smallest currency unit (cents)
            currency: "CAD",
          },
        },
      }
    );
    if (!error.value) {
      paymentStatus.value = "Payment completed";
    } else {
      paymentStatus.value = "Payment failed";
    }
  } else if (
    detailData.value.state === "DRAFT" ||
    detailData.state === "CANCELED"
  ) {
    alert("You can pay only opened order");
  } else if (detailData.value.state === "COMPLETED") {
    alert("This order is already paid.");
  }
};
</script>
