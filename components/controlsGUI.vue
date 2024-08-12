<script setup>
import { useSettingsStore } from "~/stores/useSettingsStore";
import randomId from "~/utils/randomId";
import ColorPicker from "primevue/colorpicker";
import SaveModal from "./SaveModal";

const controlsProps = defineProps({
  controls: Object,
  settings: Object,
});
import {
  ComboboxAnchor,
  ComboboxArrow,
  ComboboxCancel,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from "radix-vue";
const v = ref("");
import { v4 as uuidv4 } from "uuid";
import { fontFamily } from "./config/fontFamily.js";

const emit = defineEmits(["updateControls", "updateSteps"]);
const focused_font = "";
const settings = useSettingsStore();
const selection = useSelectionsStore();
const objectValue = useControlsStore();
const clipboard = useClipboardStore();
// const { handleFileInput, files } = useFileStorage();
const flipXObject = () => {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    if (selection.objectSelected.state.isActive === true) {
      if (selection.objectSelected.type === "svg") {
        selection.objectSelected.control[0].value +=
          800 *
          selection.objectSelected.control[6].value *
          selection.objectSelected.control[7].value;
        selection.objectSelected.control[7].value =
          -selection.objectSelected.control[7].value;
      } else if (selection.objectSelected.type === "rect") {
        selection.objectSelected.control[0].value +=
          selection.objectSelected.control[2].value *
          selection.objectSelected.control[5].value *
          selection.objectSelected.control[7].value;
        selection.objectSelected.control[7].value =
          -selection.objectSelected.control[7].value;
      } else if (selection.objectSelected.type === "circle") {
        selection.objectSelected.control[5].value =
          -selection.objectSelected.control[5].value;
      } else if (selection.objectSelected.type === "text") {
        selection.objectSelected.control[0].value +=
          (selection.objectSelected.control[2].value.length *
            selection.objectSelected.control[5].value *
            selection.objectSelected.control[4].value *
            selection.objectSelected.control[6].value *
            selection.objectSelected.control[9].value) /
          80;
        selection.objectSelected.control[6].value =
          -selection.objectSelected.control[6].value;
      } else if (selection.objectSelected.type === "pen") {
        selection.objectSelected.control[6].value =
          -selection.objectSelected.control[6].value;
      } else if (selection.objectSelected.type === "img") {
        selection.objectSelected.control[0].value +=
          300 *
          selection.objectSelected.control[4].value *
          selection.objectSelected.control[5].value;
        selection.objectSelected.control[5].value =
          -selection.objectSelected.control[5].value;
      } else if (selection.objectSelected.type === "piece") {
        selection.objectSelected.control[0].value +=
          (selection.objectSelected.control[6].value +
            selection.objectSelected.control[2].value / 2) *
          2 *
          selection.objectSelected.control[8].value *
          selection.objectSelected.control[9].value;
        selection.objectSelected.control[9].value =
          -selection.objectSelected.control[9].value;
      }
    }
  } else {
    selection.multiObjects.map((temp, index) => {
      if (temp.type === "svg") {
        temp.control[0].value +=
          800 * temp.control[6].value * temp.control[7].value;
        temp.control[7].value = -temp.control[7].value;
      } else if (temp.type === "img") {
        temp.control[0].value +=
          300 * temp.control[4].value * temp.control[5].value;
        temp.control[5].value = -temp.control[5].value;
      } else if (temp.type === "rect") {
        temp.control[0].value +=
          temp.control[2].value * temp.control[5].value * temp.control[7].value;
        temp.control[7].value = -temp.control[7].value;
      } else if (temp.type === "circle") {
        temp.control[5].value = -temp.control[5].value;
      } else if (temp.type === "text") {
        temp.control[0].value +=
          (temp.control[2].value.length *
            temp.control[5].value *
            temp.control[4].value *
            temp.control[6].value *
            temp.control[9].value) /
          80;
        temp.control[6].value = -temp.control[6].value;
      } else if (temp.type === "pen") {
        temp.control[6].value = -temp.control[6].value;
      } else if (temp.type === "piece") {
        temp.control[0].value +=
          (temp.control[6].value + temp.control[2].value / 2) *
          2 *
          temp.control[8].value *
          temp.control[9].value;
        temp.control[9].value = -temp.control[9].value;
      }
    });
  }
};

const flipYObject = () => {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    if (selection.objectSelected.state.isActive === true) {
      if (selection.objectSelected.type === "svg") {
        selection.objectSelected.control[1].value +=
          800 *
          selection.objectSelected.control[6].value *
          selection.objectSelected.control[9].value;
        selection.objectSelected.control[9].value =
          -selection.objectSelected.control[9].value;
      } else if (selection.objectSelected.type === "rect") {
        selection.objectSelected.control[1].value +=
          selection.objectSelected.control[2].value *
          selection.objectSelected.control[6].value *
          selection.objectSelected.control[8].value;
        selection.objectSelected.control[8].value =
          -selection.objectSelected.control[8].value;
      } else if (selection.objectSelected.type === "text") {
        selection.objectSelected.control[7].value =
          -selection.objectSelected.control[7].value;
      } else if (selection.objectSelected.type === "pen") {
        selection.objectSelected.control[7].value =
          -selection.objectSelected.control[7].value;
      } else if (selection.objectSelected.type === "img") {
        selection.objectSelected.control[1].value +=
          ((300 * selection.objectSelected.control[3].value) /
            selection.objectSelected.control[2].value) *
          selection.objectSelected.control[4].value *
          selection.objectSelected.control[6].value;
        selection.objectSelected.control[6].value =
          -selection.objectSelected.control[6].value;
      } else if (selection.objectSelected.type === "piece") {
        selection.objectSelected.control[1].value +=
          (selection.objectSelected.control[7].value +
            selection.objectSelected.control[3].value / 2) *
          2 *
          selection.objectSelected.control[8].value *
          selection.objectSelected.control[10].value;
        selection.objectSelected.control[10].value =
          -selection.objectSelected.control[10].value;
      }
    }
  } else {
    selection.multiObjects.map((temp, index) => {
      if (temp.type === "svg") {
        temp.control[1].value +=
          800 * temp.control[6].value * temp.control[9].value;
        temp.control[9].value = -temp.control[9].value;
      } else if (temp.type === "img") {
        temp.control[1].value +=
          ((300 * temp.control[3].value) / temp.control[2].value) *
          temp.control[4].value *
          temp.control[6].value;
        temp.control[6].value = -temp.control[6].value;
      } else if (temp.type === "rect") {
        temp.control[1].value +=
          temp.control[2].value * temp.control[6].value * temp.control[8].value;
        temp.control[8].value = -temp.control[8].value;
      } else if (temp.type === "text") {
        temp.control[7].value = -temp.control[7].value;
      } else if (temp.type === "pen") {
        temp.control[7].value = -temp.control[7].value;
      } else if (temp.type === "piece") {
        temp.control[1].value +=
          (temp.control[7].value + temp.control[3].value / 2) *
          2 *
          temp.control[8].value *
          temp.control[10].value;
        temp.control[10].value = -temp.control[10].value;
      }
    });
  }
};
function handleLayDown() {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    const index = objectValue.objectValue.indexOf(selection.objectSelected);
    if (objectValue.objectValue[index - 1] !== undefined) {
      const t = objectValue.objectValue[index - 1];
      objectValue.objectValue[index - 1] = objectValue.objectValue[index];
      objectValue.objectValue[index] = t;
    }
  }
}
function handleLayUp() {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    const index = objectValue.objectValue.indexOf(selection.objectSelected);
    if (objectValue.objectValue[index + 1] !== undefined) {
      const t = objectValue.objectValue[index + 1];
      objectValue.objectValue[index + 1] = objectValue.objectValue[index];
      objectValue.objectValue[index] = t;
    }
  }
}
const handleGrid = () => {
  objectValue.gridState = !objectValue.gridState;
};
function sorts(arry) {
  let len = arry.length;
  let xMax = -Infinity;
  let yMax = -Infinity;
  let xMin = Infinity;
  let yMin = Infinity;
  while (len--) {
    if (arry[len][0] > xMax) {
      xMax = arry[len][0];
    }
    if (arry[len][0] < xMin) {
      xMin = arry[len][0];
    }
    if (arry[len][1] > yMax) {
      yMax = arry[len][1];
    }
    if (arry[len][1] < yMin) {
      yMin = arry[len][1];
    }
  }
  return { xMax: xMax, xMin: xMin, yMax: yMax, yMin: yMin };
}
const handleCenter = () => {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    if (selection.objectSelected.state.isActive === true) {
      if (selection.objectSelected.type === "rect") {
        selection.objectSelected.control[0].value =
          400 -
          (selection.objectSelected.control[2].value *
            selection.objectSelected.control[5].value *
            selection.objectSelected.control[7].value) /
            2;
        selection.objectSelected.control[1].value =
          400 -
          (selection.objectSelected.control[3].value *
            selection.objectSelected.control[6].value *
            selection.objectSelected.control[8].value) /
            2;
      }
      if (selection.objectSelected.type === "circle") {
        selection.objectSelected.control[0].value = 400;
        selection.objectSelected.control[1].value = 400;
      }
      if (selection.objectSelected.type === "text") {
        selection.objectSelected.control[0].value =
          400 -
          (((selection.objectSelected.control[2].value.length *
            selection.objectSelected.control[9].value) /
            80) *
            selection.objectSelected.control[5].value *
            selection.objectSelected.control[4].value *
            selection.objectSelected.control[6].value) /
            2;
        selection.objectSelected.control[1].value =
          400 +
          ((selection.objectSelected.control[9].value * 3) / 8) *
            selection.objectSelected.control[4].value *
            selection.objectSelected.control[7].value;
      }
      if (selection.objectSelected.type === "svg") {
        selection.objectSelected.control[0].value =
          400 -
          (selection.objectSelected.control[6].value *
            selection.objectSelected.control[7].value *
            800) /
            2;
        selection.objectSelected.control[1].value =
          400 -
          (selection.objectSelected.control[6].value *
            selection.objectSelected.control[9].value *
            800) /
            2;
      }
      if (selection.objectSelected.type === "pen") {
        const width =
          selection.objectSelected.control[2].value -
          selection.objectSelected.control[1].value;
        const height =
          selection.objectSelected.control[4].value -
          selection.objectSelected.control[3].value;
        const xOffset =
          400 - width / 2 - selection.objectSelected.control[1].value;
        const yOffset =
          400 - height / 2 - selection.objectSelected.control[3].value;
        selection.objectSelected.control[0].value.map((tempPoint) => {
          tempPoint[0] += xOffset;
          tempPoint[1] += yOffset;
        });
        const { xMin, yMin, xMax, yMax } = sorts(
          selection.objectSelected.control[0].value
        );
        selection.objectSelected.control[1].value = xMin;
        selection.objectSelected.control[2].value = xMax;
        selection.objectSelected.control[3].value = yMin;
        selection.objectSelected.control[4].value = yMax;
      }
      if (selection.objectSelected.type === "img") {
        selection.objectSelected.control[0].value =
          400 -
          150 *
            selection.objectSelected.control[4].value *
            selection.objectSelected.control[5].value;
        selection.objectSelected.control[1].value =
          400 -
          ((150 * selection.objectSelected.control[3].value) /
            selection.objectSelected.control[2].value) *
            selection.objectSelected.control[4].value *
            selection.objectSelected.control[5].value;
      }
      if (selection.objectSelected.type === "piece") {
        selection.objectSelected.control[0].value =
          400 -
          (selection.objectSelected.control[6].value +
            selection.objectSelected.control[2].value / 2) *
            selection.objectSelected.control[8].value *
            selection.objectSelected.control[9].value;
        selection.objectSelected.control[1].value =
          400 -
          (selection.objectSelected.control[7].value +
            selection.objectSelected.control[3].value / 2) *
            selection.objectSelected.control[8].value *
            selection.objectSelected.control[10].value;
      }
    }
  } else {
    selection.multiObjects.map((temp, index) => {
      if (temp.type === "rect") {
        temp.control[0].value =
          400 -
          (temp.control[2].value *
            temp.control[5].value *
            temp.control[7].value) /
            2;
        temp.control[1].value =
          400 -
          (temp.control[3].value *
            temp.control[6].value *
            temp.control[8].value) /
            2;
      }
      if (temp.type === "circle") {
        temp.control[0].value = 400;
        temp.control[1].value = 400;
      }
      if (temp.type === "text") {
        temp.control[0].value =
          400 -
          (((temp.control[2].value.length * temp.control[9].value) / 80) *
            temp.control[5].value *
            temp.control[4].value *
            temp.control[6].value) /
            2;
        temp.control[1].value =
          400 +
          ((temp.control[9].value * 3) / 8) *
            temp.control[4].value *
            temp.control[7].value;
      }
      if (temp.type === "svg") {
        temp.control[0].value =
          400 - (temp.control[6].value * temp.control[7].value * 800) / 2;
        temp.control[1].value =
          400 - (temp.control[6].value * temp.control[9].value * 800) / 2;
      }
      if (temp.type === "img") {
        temp.control[0].value =
          400 - 150 * temp.control[4].value * temp.control[5].value;
        temp.control[1].value =
          400 -
          ((150 * temp.control[3].value) / temp.control[2].value) *
            temp.control[4].value *
            temp.control[5].value;
      }
      if (temp.type === "pen") {
        const width = temp.control[2].value - temp.control[1].value;
        const height = temp.control[4].value - temp.control[3].value;
        const xOffset = 400 - width / 2 - temp.control[1].value;
        const yOffset = 400 - height / 2 - temp.control[3].value;
        temp.control[0].value.map((tempPoint) => {
          tempPoint[0] += xOffset;
          tempPoint[1] += yOffset;
        });
        const { xMin, yMin, xMax, yMax } = sorts(temp.control[0].value);
        temp.control[1].value = xMin;
        temp.control[2].value = xMax;
        temp.control[3].value = yMin;
        temp.control[4].value = yMax;
      }
      if (temp.type === "piece") {
        temp.control[0].value =
          400 -
          (temp.control[6].value + temp.control[2].value / 2) *
            temp.control[8].value *
            temp.control[9].value;
        temp.control[1].value =
          400 -
          (temp.control[7].value + temp.control[3].value / 2) *
            temp.control[8].value *
            temp.control[10].value;
      }
    });
  }
};
const handleCopy = () => {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    if (selection.objectSelected.state.isActive === true) {
      let rando = randomId();
      clipboard.clipBoardObject = [];
      let tempClipBoard = {};
      tempClipBoard.id = rando;
      tempClipBoard.type = selection.objectSelected.type;
      tempClipBoard.control = [];
      for (let i = 0; i < selection.objectSelected.control.length; i++) {
        if (tempClipBoard.type !== "pen") {
          tempClipBoard.control.push({
            label: selection.objectSelected.control[i].label,
            type: selection.objectSelected.control[i].type,
            value: selection.objectSelected.control[i].value,
          });
        } else {
          if (i === 0) {
            let tempPointArray = [];
            for (
              let j = 0;
              j < selection.objectSelected.control[0].value.length;
              j++
            ) {
              tempPointArray.push([
                selection.objectSelected.control[0].value[j][0],
                selection.objectSelected.control[0].value[j][1],
              ]);
            }
            tempClipBoard.control.push({
              label: selection.objectSelected.control[i].label,
              type: selection.objectSelected.control[i].type,
              value: tempPointArray,
            });
          } else {
            tempClipBoard.control.push({
              label: selection.objectSelected.control[i].label,
              type: selection.objectSelected.control[i].type,
              value: selection.objectSelected.control[i].value,
            });
          }
        }
      }
      if (tempClipBoard.type !== "pen") {
        tempClipBoard.control[0].value += 20;
        tempClipBoard.control[1].value += 20;
      } else {
        tempClipBoard.control[0].value.map((tempPoint) => {
          tempPoint[0] -= 10;
          tempPoint[1] -= 10;
        });
        const { xMin, yMin, xMax, yMax } = sorts(
          tempClipBoard.control[0].value
        );
        tempClipBoard.control[1].value = xMin;
        tempClipBoard.control[2].value = xMax;
        tempClipBoard.control[3].value = yMin;
        tempClipBoard.control[4].value = yMax;
      }
      tempClipBoard.state = {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      };
      clipboard.clipBoardObject.push(tempClipBoard);
      // tempClipBoard.control[0].value += 100;
    }
  } else {
    clipboard.clipBoardObject = [];
    selection.multiObjects.map((SingleObject, index) => {
      let rando = randomId();

      let tempClipBoard = {};
      tempClipBoard.id = rando;
      tempClipBoard.type = SingleObject.type;
      tempClipBoard.control = [];
      for (let i = 0; i < SingleObject.control.length; i++) {
        if (tempClipBoard.type !== "pen") {
          tempClipBoard.control.push({
            label: SingleObject.control[i].label,
            type: SingleObject.control[i].type,
            value: SingleObject.control[i].value,
          });
        } else {
          if (i === 0) {
            let tempPointArray = [];
            for (let j = 0; j < SingleObject.control[0].value.length; j++) {
              tempPointArray.push([
                SingleObject.control[0].value[j][0],
                SingleObject.control[0].value[j][1],
              ]);
            }
            tempClipBoard.control.push({
              label: SingleObject.control[i].label,
              type: SingleObject.control[i].type,
              value: tempPointArray,
            });
          } else {
            tempClipBoard.control.push({
              label: SingleObject.control[i].label,
              type: SingleObject.control[i].type,
              value: SingleObject.control[i].value,
            });
          }
        }
      }

      if (tempClipBoard.type !== "pen") {
        tempClipBoard.control[0].value += 20;
        tempClipBoard.control[1].value += 20;
      } else {
        tempClipBoard.control[0].value.map((tempPoint) => {
          tempPoint[0] -= 10;
          tempPoint[1] -= 10;
        });
        const { xMin, yMin, xMax, yMax } = sorts(
          tempClipBoard.control[0].value
        );
        tempClipBoard.control[1].value = xMin;
        tempClipBoard.control[2].value = xMax;
        tempClipBoard.control[3].value = yMin;
        tempClipBoard.control[4].value = yMax;
      }
      tempClipBoard.state = {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      };
      clipboard.clipBoardObject.push(tempClipBoard);
    });
    // selection.multiObjects = [];
    // selection.multiSelectState = 0;
  }
};
const handlePaste = () => {
  if (selection.multiSelectState === 0 && selection.multiObjects.length < 1) {
    if (clipboard.clipBoardObject.length !== 0) {
      clipboard.clipBoardObject.map((tempClipBoard, index) => {
        selection.objectSelected.state.isActive = false;
        objectValue.objectValue.push(tempClipBoard);
        selection.getObjectSelected(tempClipBoard.id, objectValue.objectValue);
        selection.guiControlUpdate(tempClipBoard.type, tempClipBoard.id);
        selection.objectSelected.state.isActive = true;
      });
    }
    let tObject = {};
    let rando = randomId();
    tObject.id = rando;
    tObject.type = selection.objectSelected.type;
    tObject.control = [];
    for (let i = 0; i < selection.objectSelected.control.length; i++) {
      if (tObject.type !== "pen") {
        tObject.control.push({
          label: selection.objectSelected.control[i].label,
          type: selection.objectSelected.control[i].type,
          value: selection.objectSelected.control[i].value,
        });
      } else {
        if (i === 0) {
          let tempPointArray = [];
          for (
            let j = 0;
            j < selection.objectSelected.control[0].value.length;
            j++
          ) {
            tempPointArray.push([
              selection.objectSelected.control[0].value[j][0],
              selection.objectSelected.control[0].value[j][1],
            ]);
          }
          tObject.control.push({
            label: selection.objectSelected.control[i].label,
            type: selection.objectSelected.control[i].type,
            value: tempPointArray,
          });
        } else {
          tObject.control.push({
            label: selection.objectSelected.control[i].label,
            type: selection.objectSelected.control[i].type,
            value: selection.objectSelected.control[i].value,
          });
        }
      }
    }
    if (tObject.type !== "pen") {
      tObject.control[0].value += 20;
      tObject.control[1].value += 20;
    } else {
      tObject.control[0].value.map((tempPoint) => {
        tempPoint[0] -= 10;
        tempPoint[1] -= 10;
      });
      const { xMin, yMin, xMax, yMax } = sorts(tObject.control[0].value);
      tObject.control[1].value = xMin;
      tObject.control[2].value = xMax;
      tObject.control[3].value = yMin;
      tObject.control[4].value = yMax;
    }
    tObject.state = {
      isActive: false,
      activeClass: "outline outline-fuchsia-500",
    };
    clipboard.clipBoardObject = [];
    clipboard.clipBoardObject[0] = tObject;
  } else {
    selection.multiObjects.map((tempMulti, index) => {
      if (tempMulti.type === "rect") tempMulti.control[9].value = 0;
      if (tempMulti.type === "circle") tempMulti.control[7].value = 0;
      if (tempMulti.type === "text") tempMulti.control[8].value = 0;
      if (tempMulti.type === "svg") tempMulti.control[10].value = 0;
      if (tempMulti.type === "pen") tempMulti.control[8].value = 0;
      if (tempMulti.type === "img") tempMulti.control[8].value = 0;
      if (tempMulti.type === "piece") tempMulti.control[11].value = 0;
      tempMulti.state.isActive = false;
    });
    selection.multiObjects = [];
    selection.multiSelectState = 1;
    clipboard.clipBoardObject.map((tempClipBoard, index) => {
      tempClipBoard.state.isActive = true;
      objectValue.objectValue.push(tempClipBoard);
      selection.multiObjects.push(tempClipBoard);
    });
    clipboard.clipBoardObject = [];
    selection.multiObjects.map((SingleObject, index) => {
      let rando = randomId();

      let tempClipBoard = {};
      tempClipBoard.id = rando;
      tempClipBoard.type = SingleObject.type;
      tempClipBoard.control = [];
      for (let i = 0; i < SingleObject.control.length; i++) {
        if (tempClipBoard.type !== "pen") {
          tempClipBoard.control.push({
            label: SingleObject.control[i].label,
            type: SingleObject.control[i].type,
            value: SingleObject.control[i].value,
          });
        } else {
          if (i === 0) {
            let tempPointArray = [];
            for (let j = 0; j < SingleObject.control[0].value.length; j++) {
              tempPointArray.push([
                SingleObject.control[0].value[j][0],
                SingleObject.control[0].value[j][1],
              ]);
            }
            tempClipBoard.control.push({
              label: SingleObject.control[i].label,
              type: SingleObject.control[i].type,
              value: tempPointArray,
            });
          } else {
            tempClipBoard.control.push({
              label: SingleObject.control[i].label,
              type: SingleObject.control[i].type,
              value: SingleObject.control[i].value,
            });
          }
        }
      }

      if (tempClipBoard.type !== "pen") {
        tempClipBoard.control[0].value += 20;
        tempClipBoard.control[1].value += 20;
      } else {
        tempClipBoard.control[0].value.map((tempPoint) => {
          tempPoint[0] -= 10;
          tempPoint[1] -= 10;
        });
        const { xMin, yMin, xMax, yMax } = sorts(
          tempClipBoard.control[0].value
        );
        tempClipBoard.control[1].value = xMin;
        tempClipBoard.control[2].value = xMax;
        tempClipBoard.control[3].value = yMin;
        tempClipBoard.control[4].value = yMax;
      }
      tempClipBoard.state = {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      };
      clipboard.clipBoardObject.push(tempClipBoard);
    });
  }
};
function handleFontChange(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[10].value = e;
  } else {
    selection.objectSelected.control[10].value = e;
  }
}
function handleSpacingChange(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[5].value = e.target.value;
  } else {
    selection.objectSelected.control[5].value = e.target.value;
  }
}
function handleTextSizeChange(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[9].value = e.target.value;
  } else {
    selection.objectSelected.control[9].value = e.target.value;
  }
}
function handleUnderline(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[13].value[1] = e.target.checked;
  } else {
    selection.objectSelected.control[13].value[1] = e.target.checked;
  }
}
function handleLinethrough(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[13].value[3] = e.target.checked;
  } else {
    selection.objectSelected.control[13].value[3] = e.target.checked;
  }
}
function handleBold(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[13].value[0] = e.target.checked;
  } else {
    selection.objectSelected.control[13].value[0] = e.target.checked;
  }
}
function handleItalic(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[13].value[2] = e.target.checked;
  } else {
    selection.objectSelected.control[13].value[2] = e.target.checked;
  }
}
function handleColorChange(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[3].value = e.target.value;
  } else {
    selection.objectSelected.control[3].value = e.target.value;
  }
}
function handleStokeWidth(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[12].value = e.target.value;
  } else {
    selection.objectSelected.control[12].value = e.target.value;
  }
}
function handleStokeColor(e) {
  if (
    selection.multiObjects.length === 1 &&
    selection.multiObjects[0].type === "text"
  ) {
    selection.multiObjects[0].control[11].value = e.target.value;
  } else {
    selection.objectSelected.control[11].value = e.target.value;
  }
}
let imagss = "";
function handleUploadImage(e) {
  imagss = new Image();
  let width = 0,
    height = 0;

  imagss.src = URL.createObjectURL(e.target.files[0]);
  imagss.onload = function () {
    width = this.width;
    height = this.height;
    objectValue.createImage(imagss.src, width, height);
  };
  e.target.value = "";
}
function handleSave(e) {
  showModal.value = true;
}
function shortKey() {
  showShortKey.value = !showShortKey.value;
}
async function saveDesign(element) {
  const uuid = uuidv4();
  const content = JSON.stringify(objectValue.objectValue);
  const date = new Date();

  const response = await fetch("http://localhost:1337/api/saved-datas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        uuid: uuid,
        content: content,
        savedDate: date,
        name: element[0],
        userName: localStorage.getItem("userEmail"),
      },
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      showModal.value = false;
      console.log("HHHHHHHHHHHHHH", res);
    });
}
const showModal = ref(false);
const showShortKey = ref(false);
function handleCloseModal() {
  showModal.value = false;
}
</script>
<style>
.slidecontainer {
  width: 100%;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #9ba3d1;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #04aa6d;
  cursor: pointer;
}
</style>
<template>
  <SaveModal
    v-show="showModal"
    @close-modal="handleCloseModal"
    @save-design="saveDesign"
  />
  <div
    class="border border-gray-700 w-[350px] justify-between pt-2 px-3 bg-gray-900"
    :style="{ height: 'calc(100vh - 70px)' }"
  >
    <div class="px-5">
      <div class="flex space-x-2 pb-4">
        <button
          @click="flipXObject"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/flip-horizon.png" width="40" height="40" />
        </button>
        <button
          @click="flipYObject"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img
            src="../assets/images/flip-vertical.png"
            width="40"
            height="40"
          />
        </button>
        <button
          @click="handleGrid"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/grid.png" width="40" height="40" />
        </button>
        <button
          @click="handleCenter"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/center.png" width="40" height="40" />
        </button>
        <button
          @click="shortKey"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/keyboard.png" width="35" height="35" />
        </button>
      </div>
      <div class="flex space-x-2 pb-4">
        <button
          @click="handleCopy"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/copy.png" width="40" height="40" />
        </button>
        <button
          @click="handlePaste"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/paste.png" width="35" height="35" />
        </button>
        <button
          @click="handleLayDown"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/laydown.png" width="35" height="35" />
        </button>
        <button
          @click="handleLayUp"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/layup.png" width="35" height="35" />
        </button>
        <button
          @click="handleSave"
          class="bg-slate-400 w-[50px] h-[50px] rounded-md border-white border-solid border-2 flex items-center justify-center"
        >
          <img src="../assets/images/save.png" width="35" height="35" />
        </button>
      </div>
    </div>
    <button
      class="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green-200 text-green-900 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
      onclick="document.getElementById('selectedFile').click();"
    >
      Upload
    </button>
    <div>
      <br />
      <div
        v-if="
          (selection.guiControl.type === 'text' &&
            selection.objectSelected.state.isActive === true &&
            selection.multiObjects.length === 0) ||
          (selection.multiObjects.length === 1 &&
            selection.multiObjects[0].type === 'text')
        "
        class="space-y-2 bg-slate-700 px-3 py-5 rounded-md"
      >
        <div class="flex">
          <span class="w-[120px]">FontFamily</span>
          <ComboboxRoot
            v-model="v"
            class="relative"
            @update:model-value="handleFontChange"
          >
            <ComboboxAnchor
              class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-black shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none"
            >
              <ComboboxInput
                class="!bg-transparent outline-none text-grass11 h-full selection:bg-grass5 placeholder-slate-400"
                placeholder="Placeholder..."
              />
              <ComboboxTrigger> &nabla; </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent
              class="absolute z-10 mt-2 max-w-[400px] h-[600px] overflow-auto bg-slate-800 text-white overflow-hidden rounded"
            >
              <ComboboxViewport nonce class="p-[5px]">
                <ComboboxEmpty
                  class="text-mauve8 text-xs font-medium text-center py-2"
                />

                <ComboboxItem
                  v-for="(font, index) in fontFamily"
                  :key="index"
                  class="text-[13px] leading-none text-white rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none"
                  :value="font"
                  v-bind:style="{ fontFamily: font }"
                >
                  <span>
                    {{ font }}
                  </span>
                </ComboboxItem>
                <ComboboxSeparator class="h-[1px] bg-grass6 m-[5px]" />
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
        </div>
        <div class="flex">
          <span class="w-[120px]">spacing</span>
          <input
            type="range"
            min="30"
            max="100"
            step="7"
            value="30"
            class="slider"
            id="myRange"
            @input="handleSpacingChange"
          />
        </div>
        <div class="flex">
          <span class="w-[120px]">LineHeight</span>
          <input
            type="range"
            min="30"
            max="100"
            step="7"
            value="30"
            class="slider"
            id="myRange"
          />
        </div>
        <div class="flex">
          <span class="w-[120px]">TextSize</span>
          <input
            type="range"
            min="12"
            max="192"
            step="6"
            value="40"
            class="slider"
            id="myRange"
            @input="handleTextSizeChange"
          />
        </div>
        <div class="flex">
          <span class="w-[120px]">strokeWidth</span>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value="0"
            class="slider"
            id="myRange"
            @input="handleStokeWidth"
          />
        </div>
        <div class="flex space-x-3">
          Alignment&nbsp;&nbsp;&nbsp;
          <input type="radio" id="age1" name="age" value="30" />
          <label for="age1">left</label><br />
          <input type="radio" id="age2" name="age" value="60" />
          <label for="age2">center</label><br />
          <input type="radio" id="age3" name="age" value="100" />
          <label for="age3">right</label>
        </div>
        <div class="flex space-x-2">
          Decoration&nbsp;&nbsp;&nbsp;
          <input
            type="checkbox"
            name="underline"
            :value="false"
            @change="handleUnderline"
          />
          <label for="underline">underline</label>
          <input type="checkbox" name="underline" @change="handleLinethrough" />
          <label for="underline">line-through</label>
        </div>
        <div class="flex space-x-2">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            type="checkbox"
            name="underline"
            :value="false"
            @change="handleBold"
          />
          <label for="underline">Bold</label>
          <input type="checkbox" name="underline" @change="handleItalic" />
          <label for="underline">Italic</label>
        </div>
        <div class="flex justify-between">
          <label for="background">TextColor</label>
          <input
            @input="handleColorChange"
            type="color"
            id="background"
            name="background"
            class="border-none rounded bg-stone-500 w-14 h-8 pl-2 pr-2"
          />
        </div>

        <div class="flex justify-between">
          <label for="background">StokeColor</label>
          <input
            @input="handleStokeColor"
            type="color"
            id="background"
            name="background"
            class="border-none rounded bg-stone-500 w-14 h-8 pl-2 pr-2"
          />
        </div>
      </div>
      <div v-if="showShortKey === true">
        <div>Delete:&nbsp;<span class="px-2 bg-gray-500">Delete</span></div>
        <div>
          Copy:&nbsp;<span class="px-2 bg-gray-500">Ctrl</span>+<span
            class="px-2 bg-gray-500"
            >C</span
          >
        </div>
        <div>
          Paste:&nbsp;<span class="px-2 bg-gray-500">Ctrl</span>+<span
            class="px-2 bg-gray-500"
            >V</span
          >
        </div>
        <div>
          Group:&nbsp;<span class="px-2 bg-gray-500">Ctrl</span>+<span
            class="px-2 bg-gray-500"
            >G</span
          >
        </div>
        <div>
          Ungroup:&nbsp;<span class="px-2 bg-gray-500">Ctrl</span>+<span
            class="px-2 bg-gray-500"
            >Q</span
          >
        </div>
      </div>
    </div>
    <div class="flex flex-col mt-10 px-5 justify-self-end">
      <div class="space-y-2">
        <div>
          <input
            type="file"
            id="selectedFile"
            style="display: none"
            @change="handleUploadImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
