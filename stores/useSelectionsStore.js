export const useSelectionsStore = defineStore("selections", () => {
  const guiControl = ref({
    type: "",
    id: "",
  });
  const objectSelected = ref({});
  const multiSelectState = ref(0);
  const multiRect = ref({x1:0,y1:0,x2:0, y2:0});
  const multiObjects = ref([]);

  const guiControlUpdate = (type, id) => {
    if (guiControl.value.id === id) {
      return guiControl.value;
    } else if (guiControl.value.id !== id) {
      guiControl.value = {
        type,
        id,
      };
    }
  };

  const getObjectSelected = (id, object) => {
    object.filter((el) => {
      if (el.id === id) {
        objectSelected.value = el;
      }
    });
  };

  return {
    guiControl,
    guiControlUpdate,
    objectSelected,
    getObjectSelected,
    multiSelectState,multiRect,multiObjects
  };
});

// const showControls = ref(false);
// const showSettings = ref(false);
// const showAbout = ref(false);
