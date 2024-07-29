<template>
  <div class="w-full bg-slate-500 text-white rounded-sm h-[60px]">
    <div class="flex space-x-2 space-y-1">
      <div class="px-4">
        <span class="text-green-600 font-bold">OrderId:</span>
        {{ orderItems.id }}
      </div>
      <div class="orderItems px-4">
        <div v-for="orderItem in orderItems.line_items" :key="orderItem">
          &nbsp;<span class="text-green-600 font-bold">name:</span
          >{{ orderItem.name }} &nbsp;<span class="text-green-600 font-bold"
            >description:</span
          >{{ orderItem.note.slice(0, 10) }}
        </div>
      </div>
      <div>
        <span class="text-green-600 font-bold">totalAmount:</span
        >{{ orderItems.total_money.amount }}
      </div>
      <div>
        <span class="text-green-600 font-bold">currency:</span
        >{{ orderItems.total_money.currency }}
      </div>
      <div>
        <span class="text-green-600 font-bold">created:</span
        >{{ orderItems.created_at }}
      </div>
      <div>
        <span class="text-green-600 font-bold">state:</span>
        {{ orderItems.state }}
      </div>
    </div>
    <div>
      <button
        class="bg-slate-700 px-2 rounded-md float-right mr-3"
        @click="handleOrderDetail"
      >
        Pay Order
      </button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const props = defineProps({
  orderItems: {
    type: Object,
    required: true,
  },
});
const { orderItems } = props;
const router = useRouter();
function handleOrderDetail() {
  router.push(`/orderlist/?${orderItems.id}`);
}
</script>
