import randomId from "~/utils/randomId";
export const useClipboardStore = defineStore("clipboard", () => {

  const clipBoardObject = [];

  return {
    clipBoardObject,
  };
});

// const showControls = ref(false);
// const showSettings = ref(false);
// const showAbout = ref(false);
