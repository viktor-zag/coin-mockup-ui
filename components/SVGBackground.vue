<script setup>
import { Style } from "~/node_modules/nuxt/dist/head/runtime/components";
import SVGObject from "./SVGObject";
import randomId from "~/utils/randomId";

const selection = useSelectionsStore();
const MockScale = 1;

const objectValue = useControlsStore();

const settings = useSettingsStore();

const clipboard = useClipboardStore();
const drawStart = ref(0);
const xTemp = ref(0);
const yTemp = ref(0);
const temp = ref(0);
const selectableRect = ref({ x: 0, y: 0 });
const selectable = ref(0);
const multiXTemp = ref([]);
const multiYTemp = ref([]);
const gridArray = new Array(24);
const tempPoints = [];
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
const sizeTemp = ref(0);
let startPoint = { x: 0, y: 0 };
let penObjSize = { width: 0, height: 0 };
function filters(objectItem) {
  let controlIndex;
  if (objectItem.type === "rect") controlIndex = 9;
  if (objectItem.type === "circle") controlIndex = 7;
  if (objectItem.type === "text") controlIndex = 8;
  if (objectItem.type === "svg") controlIndex = 10;
  if (objectItem.type === "pen") controlIndex = 8;
  if (objectItem.type === "img") controlIndex = 8;
  if (objectItem.type === "piece") controlIndex = 11;
  if (objectItem.type === "group") controlIndex = 2;
  if (objectItem.control[controlIndex].value === 1) return false;
  return true;
}
if (!import.meta.env.SSR) {
  window.addEventListener("mousedown", (e) => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const xOffset = 350 + (vw - 1500) / 2;
    const yOffset = 70 + (vh - 870) / 2;
    if (e.x > 350 && e.x < vw - 350) {
      handleDown(e);
    }
  });
  window.addEventListener("mousemove", (e) => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const xOffset = 350 + (vw - 1500) / 2;
    const yOffset = 70 + (vh - 870) / 2;
    if (e.x > 350 && e.x < vw - 350) {
      moveTest(e);
    }
  });
  window.addEventListener("mouseup", (e) => {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const xOffset = 350 + (vw - 1500) / 2;
    const yOffset = 70 + (vh - 870) / 2;
    if (e.x > 350 && e.x < vw - 350) {
      handleUp(e);
    }
  });
  window.addEventListener("keydown", (e) => {
    let temp = { id: "", control: [], type: "", state: {} };
    if (e.keyCode === 46) {
      if (
        selection.multiSelectState === 0 &&
        selection.multiObjects.length < 1
      ) {
        if (
          selection.objectSelected.id !== undefined &&
          selection.objectSelected.state.isActive === true
        ) {
          selection.objectSelected.state.isActive = false;
          let tempIndex;
          objectValue.objectValue.map((objectItem, index) => {
            if (objectItem.id === selection.objectSelected.id) {
              tempIndex = index;
            }
          });
          objectValue.objectValue.splice(tempIndex, 1);
        }
      } else {
        objectValue.objectValue = objectValue.objectValue.filter(filters);
        selection.multiObjects = [];
        selection.multiSelectState = 0;
        objectValue.objectValue.map((temps) => {
          temps.state.isActive = false;
        });
      }
    }
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      if (
        selection.multiSelectState === 0 &&
        selection.multiObjects.length < 1
      ) {
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
    }
    if (e.ctrlKey && (e.key === "v" || e.key === "V")) {
      if (
        selection.multiSelectState === 0 &&
        selection.multiObjects.length < 1
      ) {
        if (clipboard.clipBoardObject.length !== 0) {
          clipboard.clipBoardObject.map((tempClipBoard, index) => {
            selection.objectSelected.state.isActive = false;
            objectValue.objectValue.push(tempClipBoard);
            selection.getObjectSelected(
              tempClipBoard.id,
              objectValue.objectValue
            );
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
    }
    if (e.ctrlKey && (e.key === "g" || e.key === "G")) {
      if (
        selection.multiSelectState === 0 &&
        selection.multiObjects.length < 1
      ) {
      } else {
        objectValue.createGroup();
        selection.multiObjects.map((temp, index) => {
          let copied = {};
          let rando = randomId();
          copied.id = rando;
          copied.type = temp.type;
          copied.control = [];
          for (let i = 0; i < temp.control.length; i++) {
            copied.control.push({
              label: temp.control[i].label,
              type: temp.control[i].type,
              value: temp.control[i].value,
            });
          }
          let controlIndex;
          if (copied.type === "rect") controlIndex = 9;
          if (copied.type === "circle") controlIndex = 7;
          if (copied.type === "text") controlIndex = 8;
          if (copied.type === "svg") controlIndex = 10;
          if (copied.type === "pen") controlIndex = 8;
          if (copied.type === "img") controlIndex = 8;
          if (copied.type === "piece") controlIndex = 11;
          copied.control[controlIndex].value = 0;
          copied.state = {
            isActive: false,
            activeClass: "outline outline-fuchsia-500",
          };
          objectValue.objectValue[
            objectValue.objectValue.length - 1
          ].control[0].value.push(copied);
        });
        console.log("PPPPPPPPPP", objectValue.objectValue);
        objectValue.objectValue = objectValue.objectValue.filter(filters);

        selection.multiObjects = [];
        selection.multiSelectState = 0;
        objectValue.objectValue.map((temps) => {
          temps.state.isActive = false;
        });
        console.log("PPPPPPPPPP", objectValue.objectValue);
      }
    }
    if (e.ctrlKey && (e.key === "q" || e.key === "Q")) {
      if (
        selection.multiSelectState === 0 &&
        selection.multiObjects.length < 1
      ) {
        if (selection.objectSelected.type === "group") {
          selection.objectSelected.control[0].value.map((temp, index) => {
            let copied = {};
            let rando = randomId();
            copied.id = rando;
            copied.type = temp.type;
            copied.control = [];
            for (let i = 0; i < temp.control.length; i++) {
              copied.control.push({
                label: temp.control[i].label,
                type: temp.control[i].type,
                value: temp.control[i].value,
              });
            }
            if (copied.type !== "pen") {
              copied.control[0].value =
                copied.control[0].value *
                  selection.objectSelected.control[4].value +
                selection.objectSelected.control[1].value -
                selection.objectSelected.control[0].value[0].control[0].value *
                  (selection.objectSelected.control[4].value - 1);
              copied.control[1].value =
                copied.control[1].value *
                  selection.objectSelected.control[4].value +
                selection.objectSelected.control[2].value -
                selection.objectSelected.control[0].value[0].control[1].value *
                  (selection.objectSelected.control[4].value - 1);
            } else {
              copied.control[0].value.map((tempPoint) => {
                tempPoint[0] =
                  tempPoint[0] * selection.objectSelected.control[4].value +
                  selection.objectSelected.control[1].value -
                  selection.objectSelected.control[0].value[0].control[0]
                    .value *
                    (selection.objectSelected.control[4].value - 1);
                tempPoint[1] =
                  tempPoint[1] * selection.objectSelected.control[4].value +
                  selection.objectSelected.control[2].value -
                  selection.objectSelected.control[0].value[0].control[1]
                    .value *
                    (selection.objectSelected.control[4].value - 1);
              });
              const { xMin, yMin, xMax, yMax } = sorts(copied.control[0].value);
              copied.control[1].value = xMin;
              copied.control[2].value = xMax;
              copied.control[3].value = yMin;
              copied.control[4].value = yMax;
            }
            if (copied.type === "rect") {
              copied.control[5].value =
                copied.control[5].value *
                selection.objectSelected.control[4].value;
              copied.control[6].value =
                copied.control[6].value *
                selection.objectSelected.control[4].value;
            } else if (copied.type === "circle") {
              copied.control[4].value =
                copied.control[4].value *
                selection.objectSelected.control[4].value;
            } else if (copied.type === "piece") {
              copied.control[8].value =
                copied.control[8].value *
                selection.objectSelected.control[4].value;
            } else if (copied.type === "text") {
              copied.control[4].value =
                copied.control[4].value *
                selection.objectSelected.control[4].value;
            } else if (copied.type === "img") {
              copied.control[4].value =
                copied.control[4].value *
                selection.objectSelected.control[4].value;
            } else if (copied.type === "pen") {
              copied.control[9].value =
                copied.control[9].value *
                selection.objectSelected.control[4].value;
            }
            copied.state = {
              isActive: false,
              activeClass: "outline outline-fuchsia-500",
            };
            objectValue.objectValue.push(copied);
          });
          objectValue.objectValue.splice(
            objectValue.objectValue.indexOf(selection.objectSelected),
            1
          );
        }
      }
    }
  });
  window.addEventListener("dragend", (e) => {
    if (sizeTemp.value === 0) {
      if (temp.value === 1) {
        objectValue.objectValue.map((objectItem) => {
          objectItem.state.isActive = false;
        });
        selection.objectSelected.state.isActive = true;
        temp.value = 0;
      } else {
        objectValue.objectValue.map((objectItem) => {
          objectItem.state.isActive = false;
        });
        selection.objectSelected = {};
      }
    }
    if (sizeTemp.value >= 1) {
      temp.value = 0;
      sizeTemp.value = 0;
    }
  });
}
const setIsActive = () => {
  selection.objectSelected.state.isActive = true;
  // setTimeout(() => {
  //   selection.objectSelected.state.isActive = false;
  // }, 500);
};
const test = (event) => {};

function clickedMe(element) {
  selection.getObjectSelected(element[1], objectValue.objectValue);
  selection.guiControlUpdate(element[0], element[1]);
  temp.value = 0;
  selection.objectSelected.state.isActive = true;
  setIsActive();
}
function downMulti(element) {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  temp.value = 2;
  for (let objectI = 0; objectI < objectValue.objectValue.length; objectI++) {
    if (objectValue.objectValue[objectI].type === "rect") {
      if (objectValue.objectValue[objectI].control[9].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "circle") {
      if (objectValue.objectValue[objectI].control[7].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "text") {
      if (objectValue.objectValue[objectI].control[8].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "svg") {
      if (objectValue.objectValue[objectI].control[10].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "pen") {
      if (objectValue.objectValue[objectI].control[8].value === 1) {
        multiXTemp.value.push(element[2].x - xOffset);
        multiYTemp.value.push(element[2].y - yOffset);
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "img") {
      if (objectValue.objectValue[objectI].control[8].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    } else if (objectValue.objectValue[objectI].type === "piece") {
      if (objectValue.objectValue[objectI].control[11].value === 1) {
        multiXTemp.value.push(
          element[2].x -
            xOffset -
            objectValue.objectValue[objectI].control[0].value
        );
        multiYTemp.value.push(
          element[2].y -
            yOffset -
            objectValue.objectValue[objectI].control[1].value
        );
      } else {
        multiXTemp.value.push(-100000);
        multiYTemp.value.push(-100000);
      }
    }
  }
}
function downMe(element) {
  // alert("down");
  objectValue.objectValue.map((objectItem) => {
    objectItem.state.isActive = false;
  });
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  selection.getObjectSelected(element[1], objectValue.objectValue);
  selection.guiControlUpdate(element[0], element[1]);
  if (element[0] !== "pen") {
    xTemp.value =
      element[2].x - xOffset - selection.objectSelected.control[0].value;
    yTemp.value =
      element[2].y - yOffset - selection.objectSelected.control[1].value;
  } else {
    xTemp.value = element[2].x - xOffset;
    yTemp.value = element[2].y - yOffset;
  }
  selection.objectSelected.state.isActive = true;
  temp.value = 1;

  // temp.value = 0;
  // alert(temp);
}

function focusOutText(element) {
  if (element[0] === "text") {
    selection.objectSelected.control[2].value = element[2];
  }
}
function moveTest(event) {
  // event.preventDefault();
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  if (objectValue.penState === 0) {
    if (temp.value === 2) {
      for (
        let objectI = 0;
        objectI < objectValue.objectValue.length;
        objectI++
      ) {
        if (
          objectValue.objectValue[objectI].type === "piece" &&
          objectValue.objectValue[objectI].control[11].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "rect" &&
          objectValue.objectValue[objectI].control[9].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "circle" &&
          objectValue.objectValue[objectI].control[7].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "text" &&
          objectValue.objectValue[objectI].control[8].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "svg" &&
          objectValue.objectValue[objectI].control[10].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "img" &&
          objectValue.objectValue[objectI].control[8].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value =
            event.x - xOffset - multiXTemp.value[objectI];
          objectValue.objectValue[objectI].control[1].value =
            event.y - yOffset - multiYTemp.value[objectI];
        }
        if (
          objectValue.objectValue[objectI].type === "pen" &&
          objectValue.objectValue[objectI].control[8].value === 1
        ) {
          objectValue.objectValue[objectI].control[0].value.map((tempPoint) => {
            tempPoint[0] -= multiXTemp.value[objectI] - event.x + xOffset;
            tempPoint[1] -= multiYTemp.value[objectI] - event.y + yOffset;
          });
          multiXTemp.value[objectI] = event.x - xOffset;
          multiYTemp.value[objectI] = event.y - yOffset;
          const { xMin, yMin, xMax, yMax } = sorts(
            objectValue.objectValue[objectI].control[0].value
          );
          objectValue.objectValue[objectI].control[1].value = xMin;
          objectValue.objectValue[objectI].control[2].value = xMax;
          objectValue.objectValue[objectI].control[3].value = yMin;
          objectValue.objectValue[objectI].control[4].value = yMax;
        }
      }
    } else if (temp.value === 1 && sizeTemp.value === 0) {
      if (selection.objectSelected.type === "circle") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "rect") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "text") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "svg") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "piece") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "img") {
        selection.objectSelected.control[0].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[1].value =
          event.y - yOffset - yTemp.value;
      } else if (selection.objectSelected.type === "pen") {
        selection.objectSelected.control[0].value.map((tempPoint) => {
          tempPoint[0] -= xTemp.value - event.x + xOffset;
          tempPoint[1] -= yTemp.value - event.y + yOffset;
        });
        xTemp.value = event.x - xOffset;
        yTemp.value = event.y - yOffset;
        const { xMin, yMin, xMax, yMax } = sorts(
          selection.objectSelected.control[0].value
        );
        selection.objectSelected.control[1].value = xMin;
        selection.objectSelected.control[2].value = xMax;
        selection.objectSelected.control[3].value = yMin;
        selection.objectSelected.control[4].value = yMax;
      } else if (selection.objectSelected.type === "group") {
        selection.objectSelected.control[1].value =
          event.x - xOffset - xTemp.value;
        selection.objectSelected.control[2].value =
          event.y - yOffset - yTemp.value;
        console.log(
          "PPPPPPP",
          selection.objectSelected.control[0].value[0].control[0].value,
          selection.objectSelected.control[0].value[0].control[1].value
        );
      }
    } else if (sizeTemp.value >= 1) {
      if (selection.objectSelected.type === "rect") {
        if (sizeTemp.value === 3) {
          selection.objectSelected.control[5].value =
            (event.x - xOffset - startPoint.x) /
            100 /
            selection.objectSelected.control[7].value;
          selection.objectSelected.control[6].value =
            (event.y - yOffset - startPoint.y) /
            100 /
            selection.objectSelected.control[8].value;
        }
        if (sizeTemp.value === 1) {
          selection.objectSelected.control[5].value =
            (startPoint.x - event.x + xOffset) /
            100 /
            selection.objectSelected.control[7].value;
          selection.objectSelected.control[6].value =
            (startPoint.y - event.y + yOffset) /
            100 /
            selection.objectSelected.control[8].value;
          selection.objectSelected.control[0].value = event.x - xOffset;
          selection.objectSelected.control[1].value = event.y - yOffset;
        }
        if (sizeTemp.value === 2) {
          selection.objectSelected.control[5].value =
            (event.x - xOffset - startPoint.x) /
            100 /
            selection.objectSelected.control[7].value;
          selection.objectSelected.control[6].value =
            (startPoint.y - event.y + yOffset) /
            100 /
            selection.objectSelected.control[8].value;
          selection.objectSelected.control[1].value = event.y - yOffset;
        }
        if (sizeTemp.value === 4) {
          selection.objectSelected.control[5].value =
            (startPoint.x - event.x + xOffset) /
            100 /
            selection.objectSelected.control[7].value;
          selection.objectSelected.control[6].value =
            (event.y - yOffset - startPoint.y) /
            100 /
            selection.objectSelected.control[8].value;
          selection.objectSelected.control[0].value = event.x - xOffset;
        }
      }
      if (selection.objectSelected.type === "circle") {
        selection.objectSelected.control[4].value =
          (event.x - xOffset - selection.objectSelected.control[0].value) /
          50 /
          selection.objectSelected.control[5].value;
      }
      if (selection.objectSelected.type === "text") {
        if (sizeTemp.value === 1 || sizeTemp.value === 4) {
          selection.objectSelected.control[0].value = event.x - xOffset;
          selection.objectSelected.control[4].value =
            (((startPoint.x - event.x + xOffset) * 2) /
              selection.objectSelected.control[6].value /
              selection.objectSelected.control[2].value.length /
              selection.objectSelected.control[5].value /
              selection.objectSelected.control[9].value) *
            80;
        }
        if (sizeTemp.value === 2 || sizeTemp.value === 3) {
          selection.objectSelected.control[4].value =
            (((event.x - xOffset - startPoint.x) * 2) /
              selection.objectSelected.control[2].value.length /
              selection.objectSelected.control[6].value /
              selection.objectSelected.control[5].value /
              selection.objectSelected.control[9].value) *
            80;
          selection.objectSelected.control[0].value =
            event.x -
            xOffset -
            (selection.objectSelected.control[2].value.length *
              selection.objectSelected.control[5].value *
              selection.objectSelected.control[4].value *
              selection.objectSelected.control[6].value *
              selection.objectSelected.control[9].value) /
              80;
        }
      }
      if (selection.objectSelected.type === "piece") {
        if (sizeTemp.value === 1 || sizeTemp.value === 4) {
          selection.objectSelected.control[8].value =
            ((startPoint.x - event.x + xOffset) * 2) /
            selection.objectSelected.control[2].value /
            selection.objectSelected.control[9].value;
          selection.objectSelected.control[0].value =
            event.x -
            xOffset -
            selection.objectSelected.control[6].value *
              selection.objectSelected.control[8].value *
              selection.objectSelected.control[9].value;

          selection.objectSelected.control[1].value =
            startPoint.y -
            (selection.objectSelected.control[3].value / 2 +
              selection.objectSelected.control[7].value) *
              selection.objectSelected.control[8].value *
              selection.objectSelected.control[10].value;
        }
        if (sizeTemp.value === 3 || sizeTemp.value === 2) {
          selection.objectSelected.control[8].value =
            ((event.x - xOffset - startPoint.x) * 2) /
            selection.objectSelected.control[2].value /
            selection.objectSelected.control[9].value;
          selection.objectSelected.control[0].value =
            event.x -
            xOffset -
            selection.objectSelected.control[2].value *
              selection.objectSelected.control[8].value *
              selection.objectSelected.control[9].value -
            selection.objectSelected.control[6].value *
              selection.objectSelected.control[8].value *
              selection.objectSelected.control[9].value;

          selection.objectSelected.control[1].value =
            startPoint.y -
            (selection.objectSelected.control[3].value / 2 +
              selection.objectSelected.control[7].value) *
              selection.objectSelected.control[8].value *
              selection.objectSelected.control[10].value;
        }

        // selection.objectSelected.control[8].value =
        //   (startPoint.x - event.x + xOffset) /
        //   selection.objectSelected.control[2].value;
        // selection.objectSelected.control[1].value =
        //   startPoint.y -
        //   ((startPoint.x - event.x + xOffset) *
        //     selection.objectSelected.control[3].value) /
        //     selection.objectSelected.control[2].value -
        //   selection.control[7].value;

        // selection.objectSelected.control[8].value =
        //   ((startPoint.x - event.x + xOffset) /
        //     selection.objectSelected.control[2].value) *
        //   2;
      }
      if (selection.objectSelected.type === "svg") {
        if (sizeTemp.value === 1 || sizeTemp.value === 4) {
          selection.objectSelected.control[0].value = event.x - xOffset;
          selection.objectSelected.control[1].value =
            startPoint.y -
            (startPoint.x - event.x + xOffset) *
              selection.objectSelected.control[7].value *
              selection.objectSelected.control[9].value;
          selection.objectSelected.control[6].value =
            ((startPoint.x - event.x + xOffset) * 2) /
            800 /
            selection.objectSelected.control[7].value;
        } else if (sizeTemp.value === 2 || sizeTemp.value === 3) {
          selection.objectSelected.control[6].value =
            ((event.x - xOffset - startPoint.x) * 2) /
            800 /
            selection.objectSelected.control[7].value;
          selection.objectSelected.control[1].value =
            startPoint.y -
            (event.x - xOffset - startPoint.x) *
              selection.objectSelected.control[7].value *
              selection.objectSelected.control[9].value;
          selection.objectSelected.control[0].value =
            event.x -
            xOffset -
            800 *
              selection.objectSelected.control[6].value *
              selection.objectSelected.control[7].value;
        }
      }
      if (selection.objectSelected.type === "pen") {
        if (sizeTemp.value === 1 || sizeTemp.value === 4)
          selection.objectSelected.control[5].value =
            (startPoint.x - event.x + xOffset) /
            penObjSize.width /
            selection.objectSelected.control[6].value;
        else if (sizeTemp.value === 2 || sizeTemp.value === 3)
          selection.objectSelected.control[5].value =
            (event.x - xOffset - startPoint.x) /
            penObjSize.width /
            selection.objectSelected.control[6].value;
      }
      if (selection.objectSelected.type === "img") {
        if (sizeTemp.value === 1 || sizeTemp.value === 4) {
          selection.objectSelected.control[0].value = event.x - xOffset;
          selection.objectSelected.control[1].value =
            startPoint.y -
            ((startPoint.x - event.x + xOffset) *
              selection.objectSelected.control[3].value) /
              selection.objectSelected.control[2].value;
          selection.objectSelected.control[4].value =
            (startPoint.x - event.x + xOffset) /
            150 /
            selection.objectSelected.control[5].value;
        } else {
          // selection.objectSelected.control[1].value =
          //   startPoint.y -
          //   (( event.x - xOffset - startPoint. x) *
          //     selection.objectSelected.control[3].value) /
          //     selection.objectSelected.control[2].value;
          selection.objectSelected.control[4].value =
            (event.x - xOffset - startPoint.x) /
            150 /
            selection.objectSelected.control[5].value;
          selection.objectSelected.control[0].value =
            event.x -
            xOffset -
            300 *
              selection.objectSelected.control[4].value *
              selection.objectSelected.control[5].value;
          selection.objectSelected.control[1].value =
            startPoint.y -
            ((event.x - xOffset - startPoint.x) *
              selection.objectSelected.control[3].value) /
              selection.objectSelected.control[2].value;
        }
      }
    } else if (temp.value === 0) {
      selectableRect.value.x = event.x - xOffset;
      selectableRect.value.y = event.y - yOffset;
    }
  } else if (drawStart.value === 1) {
    selection.objectSelected.control[0].value.push([
      event.x - xOffset,
      event.y - yOffset,
    ]);
  }
}
function tests(event) {
  // alert("1");
}
function handleUp(event) {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  selectable.value = 0;
  if (objectValue.penState === 1 && drawStart.value === 1) {
    drawStart.value = 0;
    objectValue.penState = 0;
    selection.objectSelected.state.isActive = true;
    const { xMin, yMin, xMax, yMax } = sorts(
      selection.objectSelected.control[0].value
    );
    selection.objectSelected.control[1].value = xMin;
    selection.objectSelected.control[2].value = xMax;
    selection.objectSelected.control[3].value = yMin;
    selection.objectSelected.control[4].value = yMax;
  } else {
    if (sizeTemp.value === 0) {
      if (temp.value === 1) {
        objectValue.objectValue.map((objectItem) => {
          objectItem.state.isActive = false;
        });
        selection.objectSelected.state.isActive = true;
        temp.value = 0;
      } else if (temp.value === 2) {
        objectValue.objectValue.map((objectItem) => {
          if (objectItem.type === "rect" && objectItem.control[9].value === 0) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "circle" &&
            objectItem.control[7].value === 0
          ) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "text" &&
            objectItem.control[8].value === 0
          ) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "svg" &&
            objectItem.control[10].value === 0
          ) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "pen" &&
            objectItem.control[8].value === 0
          ) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "img" &&
            objectItem.control[8].value === 0
          ) {
            objectItem.state.isActive = false;
          } else if (
            objectItem.type === "piece" &&
            objectItem.control[11].value === 0
          ) {
            objectItem.state.isActive = false;
          } else {
            objectItem.state.isActive = true;
          }
          multiXTemp.value = [];
          multiYTemp.value = [];
          temp.value = 0;
        });
      } else {
        objectValue.objectValue.map((objectItem) => {
          objectItem.state.isActive = false;
        });
        selection.multiRect.x2 = Math.max(0, event.x - xOffset);
        selection.multiRect.y2 = Math.max(0, event.y - yOffset);
        for (
          let objectI = 0;
          objectI < objectValue.objectValue.length;
          objectI++
        ) {
          if (objectValue.objectValue[objectI].id !== undefined) {
            let objectTemp = objectValue.objectValue[objectI];
            if (objectTemp.type === "rect") {
              if (
                objectTemp.control[0].value <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[0].value >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[1].value <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                objectTemp.control[1].value >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                if (
                  objectTemp.control[0].value +
                    objectTemp.control[2].value *
                      objectTemp.control[7].value *
                      objectTemp.control[5].value <=
                    Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                  objectTemp.control[0].value +
                    objectTemp.control[2].value *
                      objectTemp.control[7].value *
                      objectTemp.control[5].value >=
                    Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                  objectTemp.control[1].value +
                    objectTemp.control[3].value *
                      objectTemp.control[6].value *
                      objectTemp.control[8].value <=
                    Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                  objectTemp.control[1].value +
                    objectTemp.control[3].value *
                      objectTemp.control[6].value *
                      objectTemp.control[8].value >=
                    Math.min(selection.multiRect.y2, selection.multiRect.y1)
                ) {
                  objectValue.objectValue[objectI].state.isActive = true;
                  objectValue.objectValue[objectI].control[9].value = 1;
                  selection.multiObjects.push(objectValue.objectValue[objectI]);
                  selection.multiSelectState = 1;
                }
              }
            } else if (objectTemp.type === "circle") {
              if (
                objectTemp.control[0].value <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[0].value >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[1].value <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                objectTemp.control[1].value >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                objectValue.objectValue[objectI].state.isActive = true;
                objectValue.objectValue[objectI].control[7].value = 1;
                selection.multiObjects.push(objectValue.objectValue[objectI]);
                selection.multiSelectState = 1;
              }
            } else if (objectTemp.type === "text") {
              if (
                objectTemp.control[0].value <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[0].value >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[1].value <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                objectTemp.control[1].value >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                if (
                  objectTemp.control[0].value +
                    ((objectTemp.control[2].value.length *
                      objectTemp.control[5].value *
                      objectTemp.control[4].value *
                      objectTemp.control[9].value) /
                      80) *
                      objectTemp.control[6].value <=
                    Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                  objectTemp.control[0].value +
                    ((objectTemp.control[2].value.length *
                      objectTemp.control[5].value *
                      objectTemp.control[4].value *
                      objectTemp.control[9].value) /
                      80) *
                      objectTemp.control[6].value >=
                    Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                  objectTemp.control[1].value -
                    (30 - (objectTemp.control[9].value / 80) * 6) <=
                    Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                  objectTemp.control[1].value -
                    (30 - (objectTemp.control[9].value / 80) * 6) >=
                    Math.min(selection.multiRect.y2, selection.multiRect.y1)
                ) {
                  objectValue.objectValue[objectI].state.isActive = true;
                  objectValue.objectValue[objectI].control[8].value = 1;
                  selection.multiObjects.push(objectValue.objectValue[objectI]);
                  selection.multiSelectState = 1;
                }
              }
            } else if (objectTemp.type === "svg") {
              if (
                objectTemp.control[0].value +
                  400 *
                    objectTemp.control[6].value *
                    objectTemp.control[7].value <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[0].value +
                  400 *
                    objectTemp.control[6].value *
                    objectTemp.control[7].value >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[1].value +
                  400 *
                    objectTemp.control[6].value *
                    objectTemp.control[9].value <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                objectTemp.control[1].value +
                  400 *
                    objectTemp.control[6].value *
                    objectTemp.control[9].value >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                objectValue.objectValue[objectI].state.isActive = true;
                objectValue.objectValue[objectI].control[10].value = 1;
                selection.multiObjects.push(objectValue.objectValue[objectI]);
                selection.multiSelectState = 1;
              }
            } else if (objectTemp.type === "img") {
              if (
                objectTemp.control[0].value +
                  150 *
                    objectTemp.control[4].value *
                    objectTemp.control[5].value <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[0].value +
                  150 *
                    objectTemp.control[4].value *
                    objectTemp.control[5].value >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                objectTemp.control[1].value +
                  ((150 * objectTemp.control[3].value) /
                    objectTemp.control[2].value) *
                    objectTemp.control[4].value *
                    objectTemp.control[6].value <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                objectTemp.control[1].value +
                  ((150 * objectTemp.control[3].value) /
                    objectTemp.control[2].value) *
                    objectTemp.control[4].value *
                    objectTemp.control[6].value >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                objectValue.objectValue[objectI].state.isActive = true;
                objectValue.objectValue[objectI].control[8].value = 1;
                selection.multiObjects.push(objectValue.objectValue[objectI]);
                selection.multiSelectState = 1;
              }
            } else if (objectTemp.type === "pen") {
              if (
                (objectTemp.control[1].value + objectTemp.control[2].value) /
                  2 <=
                  Math.max(selection.multiRect.x2, selection.multiRect.x1) &&
                (objectTemp.control[1].value + objectTemp.control[2].value) /
                  2 >=
                  Math.min(selection.multiRect.x2, selection.multiRect.x1) &&
                (objectTemp.control[3].value + objectTemp.control[4].value) /
                  2 <=
                  Math.max(selection.multiRect.y2, selection.multiRect.y1) &&
                (objectTemp.control[3].value + objectTemp.control[4].value) /
                  2 >=
                  Math.min(selection.multiRect.y2, selection.multiRect.y1)
              ) {
                objectValue.objectValue[objectI].state.isActive = true;
                objectValue.objectValue[objectI].control[8].value = 1;
                selection.multiObjects.push(objectValue.objectValue[objectI]);
                selection.multiSelectState = 1;
              }
            } else if (objectTemp.type === "piece") {
              if (
                objectTemp.control[0].value +
                  (objectTemp.control[2].value / 2 +
                    objectTemp.control[6].value) *
                    objectTemp.control[8].value *
                    objectTemp.control[9].value <=
                  Math.max(selection.multiRect.x1, selection.multiRect.x2) &&
                objectTemp.control[0].value +
                  (objectTemp.control[2].value / 2 +
                    objectTemp.control[6].value) *
                    objectTemp.control[8].value *
                    objectTemp.control[9].value >=
                  Math.min(selection.multiRect.x1, selection.multiRect.x2) &&
                objectTemp.control[1].value +
                  (objectTemp.control[3].value / 2 +
                    objectTemp.control[7].value) *
                    objectTemp.control[8].value *
                    objectTemp.control[10].value <=
                  Math.max(selection.multiRect.y1, selection.multiRect.y2) &&
                objectTemp.control[1].value +
                  (objectTemp.control[3].value / 2 +
                    objectTemp.control[7].value) *
                    objectTemp.control[8].value *
                    objectTemp.control[10].value >=
                  Math.min(selection.multiRect.y1, selection.multiRect.y2)
              ) {
                objectValue.objectValue[objectI].state.isActive = true;
                objectValue.objectValue[objectI].control[11].value = 1;
                selection.multiObjects.push(objectValue.objectValue[objectI]);
                selection.multiSelectState = 1;
              }
            }
          }
        }
        if (selection.multiObjects.length === 0) {
          selection.multiSelectState = 0;
        }
        // selection.objectSelected = {};
      }
    }
    if (sizeTemp.value >= 1) {
      temp.value = 0;
      sizeTemp.value = 0;
    }
  }
}

function downSize(element) {
  selection.getObjectSelected(element[1], objectValue.objectValue);
  selection.guiControlUpdate(element[0], element[1]);
  temp.value = 1;
  setIsActive();
  if (element[0] === "rect") {
    if (element[2] === 3) {
      startPoint.x = selection.objectSelected.control[0].value;
      startPoint.y = selection.objectSelected.control[1].value;
      sizeTemp.value = 3;
    } else if (element[2] === 1) {
      startPoint.x =
        selection.objectSelected.control[0].value +
        100 *
          selection.objectSelected.control[5].value *
          selection.objectSelected.control[7].value;
      startPoint.y =
        selection.objectSelected.control[1].value +
        100 *
          selection.objectSelected.control[6].value *
          selection.objectSelected.control[8].value;
      sizeTemp.value = 1;
    } else if (element[2] === 2) {
      startPoint.x = selection.objectSelected.control[0].value;
      startPoint.y =
        selection.objectSelected.control[1].value +
        100 *
          selection.objectSelected.control[6].value *
          selection.objectSelected.control[8].value;
      sizeTemp.value = 2;
    } else if (element[2] === 4) {
      startPoint.x =
        selection.objectSelected.control[0].value +
        100 *
          selection.objectSelected.control[5].value *
          selection.objectSelected.control[7].value;
      startPoint.y = selection.objectSelected.control[1].value;
      sizeTemp.value = 4;
    }
  }
  if (element[0] === "circle") {
    // if (element[2] === 1) {
    sizeTemp.value = 1;
    // }
  }
  if (element[0] === "text") {
    sizeTemp.value = element[2];
    startPoint.x =
      (((selection.objectSelected.control[2].value.length *
        selection.objectSelected.control[9].value) /
        80) *
        selection.objectSelected.control[5].value *
        selection.objectSelected.control[4].value) /
        selection.objectSelected.control[6].value /
        2 +
      selection.objectSelected.control[0].value;
    startPoint.y =
      selection.objectSelected.control[1].value -
      (15 +
        selection.objectSelected.control[4].value *
          66 *
          selection.objectSelected.control[7].value) /
        2;
  }
  if (element[0] === "svg") {
    sizeTemp.value = element[2];
    startPoint.x =
      selection.objectSelected.control[0].value +
      (800 / 2) *
        selection.objectSelected.control[6].value *
        selection.objectSelected.control[7].value;
    startPoint.y =
      selection.objectSelected.control[1].value +
      400 *
        selection.objectSelected.control[6].value *
        selection.objectSelected.control[9].value;
  }
  if (element[0] === "pen") {
    penObjSize.width =
      (selection.objectSelected.control[2].value -
        selection.objectSelected.control[1].value) /
      2;
    penObjSize.height =
      (selection.objectSelected.control[4].value -
        selection.objectSelected.control[3].value) /
      2;
    startPoint.x =
      (selection.objectSelected.control[2].value +
        selection.objectSelected.control[1].value) /
      2;
    startPoint.y =
      (selection.objectSelected.control[3].value +
        selection.objectSelected.control[4].value) /
      2;
    sizeTemp.value = element[2];
  }
  if (element[0] === "img") {
    sizeTemp.value = element[2];
    startPoint.x =
      selection.objectSelected.control[0].value +
      150 *
        selection.objectSelected.control[4].value *
        selection.objectSelected.control[5].value;
    startPoint.y =
      selection.objectSelected.control[1].value +
      ((150 * selection.objectSelected.control[3].value) /
        selection.objectSelected.control[2].value) *
        selection.objectSelected.control[4].value *
        selection.objectSelected.control[5].value;
  }
  if (element[0] === "piece") {
    sizeTemp.value = element[2];
    startPoint.x =
      selection.objectSelected.control[0].value +
      selection.objectSelected.control[6].value *
        selection.objectSelected.control[8].value *
        selection.objectSelected.control[9].value +
      (selection.objectSelected.control[2].value / 2) *
        selection.objectSelected.control[8].value *
        selection.objectSelected.control[9].value;
    startPoint.y =
      selection.objectSelected.control[1].value +
      selection.objectSelected.control[7].value *
        selection.objectSelected.control[8].value *
        selection.objectSelected.control[10].value +
      (selection.objectSelected.control[3].value / 2) *
        selection.objectSelected.control[8].value *
        selection.objectSelected.control[10].value;
  }
}

function upSize(element) {
  sizeTemp.value = 0;
}
function handleDrop(e) {
  if (sizeTemp.value === 0) {
    if (temp.value === 1) {
      objectValue.objectValue.map((objectItem) => {
        objectItem.state.isActive = false;
      });
      selection.objectSelected.state.isActive = true;
      temp.value = 0;
    } else {
      objectValue.objectValue.map((objectItem) => {
        objectItem.state.isActive = false;
      });
      selection.objectSelected = {};
    }
  }
  if (sizeTemp.value >= 1) {
    temp.value = 0;
    sizeTemp.value = 0;
  }
}
function handleDown(e) {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  if (objectValue.penState === 1) {
    drawStart.value = 1;
    selection.objectSelected.control[0].value.push([
      e.x - xOffset,
      e.y - yOffset,
    ]);
    const { xMin, yMin, xMax, yMax } = sorts(
      selection.objectSelected.control[0].value
    );
    selection.objectSelected.control[1].value = xMin;
    selection.objectSelected.control[2].value = xMax;
    selection.objectSelected.control[3].value = yMin;
    selection.objectSelected.control[4].value = yMax;
  } else if (temp.value === 0 || temp.value === 1) {
    selection.multiObjects = [];
    selectable.value = 1;
    selection.multiSelectState = 0;
    selection.multiRect.x1 = e.x - xOffset;
    selection.multiRect.y1 = e.y - yOffset;
    for (let objectI = 0; objectI < objectValue.objectValue.length; objectI++) {
      if (objectValue.objectValue[objectI].type === "rect") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[9].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "circle") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[7].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "text") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[8].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "svg") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[10].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "pen") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[8].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "img") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[8].value = 0;
      }
      if (objectValue.objectValue[objectI].type === "piece") {
        multiXTemp.value = [];
        multiYTemp.value = [];
        objectValue.objectValue[objectI].control[11].value = 0;
      }
    }
  }
}
function handleDragOver(e) {
  e.preventDefault();
  selection.objectSelected.control[0].value = e.layerX;
  selection.objectSelected.control[1].value = e.layerY;
}
function handleGroupDown(element, event) {
  objectValue.objectValue.map((objectItem) => {
    objectItem.state.isActive = false;
  });
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const xOffset = 350 + (vw - 1500) / 2;
  const yOffset = 70 + (vh - 870) / 2;
  selection.getObjectSelected(element.id, objectValue.objectValue);
  selection.guiControlUpdate(element.type, element.id);
  xTemp.value = event.x - xOffset - selection.objectSelected.control[1].value;
  yTemp.value = event.y - yOffset - selection.objectSelected.control[2].value;
  selection.objectSelected.state.isActive = true;
  temp.value = 1;
}
</script>
<style scoped>
.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>
<template>
  <div
    class="flex align-middle justify-center items-center"
    :style="{
      width: 'calc(100vw - 700px)',
      'background-color': white,
    }"
  >
    <svg
      width="800"
      height="800"
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      class="border-dashed border-2 border-gray-500 relative"
      :style="{
        'background-color': settings.svgBackground,
      }"
    >
      <g v-if="objectValue.gridState === true">
        <line
          v-for="(temp, index) in gridArray"
          :key="index"
          :x1="`${32 * (index + 1)}`"
          y1="0"
          :x2="`${32 * (index + 1)}`"
          y2="800"
          style="stroke: #bbb; stroke-dasharray: 1ch; stroke-width: 2"
        />
        <line
          v-for="(temp, index) in gridArray"
          :key="index"
          :y1="`${32 * (index + 1)}`"
          x1="0"
          :y2="`${32 * (index + 1)}`"
          x2="800"
          style="stroke: #bbb; stroke-dasharray: 1ch; stroke-width: 2"
        />
      </g>
      <rect
        v-if="temp === 0 && selectable === 1"
        :x="Math.min(selection.multiRect.x1, selectableRect.x)"
        :y="Math.min(selection.multiRect.y1, selectableRect.y)"
        :width="Math.abs(selectableRect.x - selection.multiRect.x1)"
        :height="Math.abs(selectableRect.y - selection.multiRect.y1)"
        fill="#3333ff33"
      />
      <template v-for="(e, index) in objectValue.objectValue" :key="index">
        <SVGObject
          v-if="e.type !== 'group'"
          :model="e"
          @downRect="downMe"
          @downCircle="downMe"
          @downText="downMe"
          @downSvg="downMe"
          @downPen="downMe"
          @downImg="downMe"
          @focusOutText="focusOutText"
          @downRectSize="downSize"
          @downCircleSize="downSize"
          @downTextSize="downSize"
          @downSvgSize="downSize"
          @downPenSize="downSize"
          @downImgSize="downSize"
          @upRectSize="upSize"
          @upCircleSize="upSize"
          @upTextSize="upSize"
          @upSvgSize="upSize"
          @upPenSize="upSize"
          @upImgSize="upSize"
          @multiRect="downMulti"
          @multiCircle="downMulti"
          @multiText="downMulti"
          @downPieceSize="downSize"
          @upPieceSize="upSize"
          @multiSvg="downMulti"
          @multiPen="downMulti"
          @multiImg="downMulti"
          @downPiece="downMe"
          @multiPiece="downMulti"
        />
        <svg
          v-if="e.type === 'group'"
          :x="e.control[1].value"
          :y="e.control[2].value"
          @mousedown="
            (event) => {
              handleGroupDown(e, event);
            }
          "
          :class="`${
            e.state.isActive === true ? 'outline outline-2 outline-sky-500' : ''
          }`"
        >
          <g
            :transform="`translate(${
              -e.control[0].value[0].control[0].value * (e.control[4].value - 1)
            }, ${
              -e.control[0].value[0].control[1].value * (e.control[4].value - 1)
            }) scale(${e.control[4].value})`"
          >
            <!-- <rect x="10" y="10" width="300" height="300" /> -->
            <SVGObject
              v-for="(ee, index) in e.control[0].value"
              :key="index"
              :model="ee"
            />
          </g>
        </svg>
      </template>
    </svg>
  </div>
</template>
