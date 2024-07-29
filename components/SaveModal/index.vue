<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["save-design"]);
const saveName = ref("");
function handleSaveChange(e) {
  saveName.value = e.target.value;
}
const handleSave = () => {
  if (localStorage.getItem("accessToken")) {
    emit("save-design", [saveName.value]);
  } else {
    alert("Sign in First.");
  }
};
</script>
<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h6>Save your design!</h6>
      <input
        type="text"
        @change="handleSaveChange"
        placeholder="enter your design name"
        class="border border-solid border-black w-[90%] h-[40px] text-black pl-2"
      />
      <button @click="handleSave">SaveDesign</button>
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
  height: 300px;
  width: 500px;
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
