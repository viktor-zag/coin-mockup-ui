import randomId from "~/utils/randomId";
export const useControlsStore = defineStore("controls", () => {
  const circleValue = ref();
  const selection = useSelectionsStore();
  const objectValue = ref([
    
  ]);

  const savedData = ref([]);
  const userEmail = ref("");
  const gridState = ref(true);
  const createGroup = () => {
    let rando = randomId();
    objectValue.value.push({
      id:rando,
      type:"group",
      control:[
        {
          label:"shapes",
          value:[],
          type:"number"
        },
        {
          label:"x",
          value:0,
          type:"number"
        },
        {
          label:"y",
          value:0,
          type:"number"
        },
        {
          label:"offsets",
          value:[],
          type:"number"
        },{
          label:"scale",
          value:1,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    })
  }
  const createPiece = (imageUrl) => {
    let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "piece",
      control: [
        {
          label: "x",
          value: 0,
          type: "number",
        },
        {
          label: "y",
          value: 0,
          type: "number",
        },
        {
          label: "width",
          value: 300,
          type: "number",
        },
        {
          label: "height",
          value: 300,
          type: "number",
        },
        {
          label:"color",
          value:"#f0f0f0",
          type:"color"
        },
        {
          label:"svgString",
          value:imageUrl,
          type:"string"
        },
        {
          label:"rx",
          value:0,
          type:"number"
        },
        {
          label:"ry",
          value:0,
          type:"number"
        },
        {
          label:"scale",
          value:0.5,
          type:"number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },
        {
          label:"multiSelect",
          value:0,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
  };
  const createSvg = (imageUrl) => {
    let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "svg",
      control: [
        {
          label: "x",
          value: 10,
          type: "number",
        },
        {
          label: "y",
          value: 10,
          type: "number",
        },
        {
          label: "width",
          value: 300,
          type: "number",
        },
        {
          label: "height",
          value: 300,
          type: "number",
        },
        {
          label:"color",
          value:"#f0f0f0",
          type:"color"
        },
        {
          label: "datas",
          value: imageUrl,
          type: "string",
        },
        {
          label:"scale",
          value:0.5,
          type:"number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"svgString",
          value:"",
          type:"string"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },{
          label:"multiState",
          value:0,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
  };
  const penState = ref(0);

  const createPen = () => {
    let rando = randomId();
    objectValue.value.push({
      id: rando,
      type: "pen",
      control: [
        {
          label: "points",
          value: [
          ],
          type: "array",
        },
        {
          label:"xMin",
          value:0,
          type:"number"
        },
        {
          label:"xMax",
          value:0,
          type:"number"
        },
        {
          label:"yMin",
          value:0,
          type:"number"
        },
        {
          label:"yMax",
          value:0,
          type:"number"
        },
        {
          label:"Scale",
          value:1,
          type:"number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },{
          label:"multiState",
          value:0,
          type:"number"
        },{
          label:"stroke",
          value:3,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
    selection.getObjectSelected(rando, objectValue.value);
    selection.guiControlUpdate("pen", rando);
  }

  const createCircle = () => {
    let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "circle",
      control: [
        {
          label: "cx",
          value: 103,
          type: "number",
        },
        {
          label: "cy",
          value: 50,
          type: "number",
        },
        {
          label: "radius",
          value: 50,
          type: "number",
        },
        {
          label: "color",
          value: "#FCDC7D",
          type: "color",
        },
        {
          label:"scale",
          value:1,
          type:"number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },
        {
          label:"multiState",
          value:0,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
  };
const createImage = (img, width, height) => {
  let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "img",
      control: [
        {
          label: "x",
          value: 10,
          type: "number",
        },
        {
          label: "y",
          value: 10,
          type: "number",
        },
        {
          label: "width",
          value: width,
          type: "number",
        },
        {
          label: "height",
          value: height,
          type: "number",
        },
        {
          label:"scale",
          value:0.4,
          type:"number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        
        {
          label:"flipY",
          value:1,
          type:"number"
        },
        {
          label:"svgString",
          value:img,
          type:"string"
        },
        {
          label:"multiState",
          value:0,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
}
  const createText = () => {
    let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "text",
      control: [
        {
          label: "x",
          value: 100,
          type: "number",
        },
        {
          label: "y",
          value: 100,
          type: "number",
        },
        {
          label: "text",
          value: "This is a new Text",
          type: "string",
        },
        {
          label: "color",
          value: "#0000ff",
          type: "color",
        },
        {
          label:"scaleX",
          value:1,
          type:"number"
        },
        {
          label:"scaleY",
          value:30,
          type:'number'
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },{
          label:"multiState",
          value:0,
          type:"number"
        },
        {
          label:"fontSize",
          value:40,
          type:"number"
        },
        {
          label:"fontFamily",
          value:"Arial",
          type:"string"
        },
        {
          label:"strokeColor",
          value:"#ff0000",
          type:"color"
        },
        {
          label:"strokeWidth",
          value:0,
          type:"number"
        },
        {
          label:"textDecoration",
          value:[0, 0, 0, 0],
          type:"array"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
  };

  const createRect = () => {
    let rando = randomId();
    penState.value = 0;
    objectValue.value.push({
      id: rando,
      type: "rect",
      control: [
        {
          label: "x",
          value: 102,
          type: "number",
        },
        {
          label: "y",
          value: 50,
          type: "number",
        },
        {
          label: "width",
          value: 100,
          type: "number",
        },
        {
          label: "height",
          value: 100,
          type: "number",
        },
        {
          label: "color",
          value: "#FCDC7D",
          type: "color",
        },
        {
          label: "scaleX",
          value: 1,
          type: "number"
        },
        {
          label: "scaleY",
          value: 1,
          type: "number"
        },
        {
          label:"flipX",
          value:1,
          type:"number"
        },
        {
          label:"flipY",
          value:1,
          type:"number"
        },
        {
          label:"multiState",
          value:0,
          type:"number"
        }
      ],
      state: {
        isActive: false,
        activeClass: "outline outline-fuchsia-500",
      },
    });
  };

  const rectValue = ref({
    x: {
      label: "x",
      value: 10,
      type: "number",
    },
    y: {
      label: "y",
      value: 10,
      type: "number",
    },
    width: {
      label: "width",
      value: 200,
      type: "number",
    },
    height: {
      label: "height",
      value: 100,
      type: "number",
    },
    color: {
      label: "color",
      value: "#04AA6D",
      type: "color",
    },
    rectState: {
      isActive: false,
      activeClass: "outline outline-fuchsia-500",
    },
  });

  return {
    circleValue,
    objectValue,
    createCircle,
    createRect,
    createText,
    createSvg,
    rectValue,
    penState,
    createPen,
    gridState,
    createGroup,
    createImage,
    createPiece,
    userEmail,
    savedData
  };
});

// const showControls = ref(false);
// const showSettings = ref(false);
// const showAbout = ref(false);
