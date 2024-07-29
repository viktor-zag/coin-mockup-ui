<script setup lang="jsx">
import testObject from "~/components/testObject";

const el = ref([
  {
    label: "first",
    value: "aja",
    cx: 45,
    color: "green",
    type: "circle",
  },
  {
    label: "second",
    value: "bulu",
    cx: 30,
    color: "red",
    type: "rect",
  },
]);

const objectRef = ref({
  cx: 0,
  color: "#FF0000",
  type: "",
});

const createObject = () => {
  el.value.push({ ...objectRef.value });
};

function reorder(array, newOrder) {
  const newArray = [...array]; // create a copy of the array
  const reorderedArray = newOrder.map((index) => newArray.splice(index, 1)[0]); // pick elements from the copy based on the new order
  el.value = reorderedArray;
  return reorderedArray;
}
</script>

<template>
  <div>
    test page
    <svg viewBox="0 0 100 100" class="mt-10 w-80 h-80 border"></svg>
    <button @click="reorder(el, [1, 0])">Create Object</button>
    <div class="text-black">
      <div>
        <label for="cx">cx</label>
        <input v-model="objectRef.cx" type="number" name="cx" id="" />
      </div>
      <div>
        <label for="color">color</label>
        <input v-model="objectRef.color" type="color" name="color" id="" />
      </div>
      <div>
        <label for="type">type</label>
        <input v-model="objectRef.type" type="text" name="type" id="" />
      </div>
      <button @click="createObject" class="border bg-slate-600 text-red-400">
        Create
      </button>
    </div>
  </div>
</template>
