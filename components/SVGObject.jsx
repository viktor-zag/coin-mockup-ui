export default defineComponent(
  (props, ctx) => {
    const iconStatusMapping = ref({
      todo: `<div></div>`,
      processing: <div>...</div>,
      done: <div>...</div>,
    });
    const boundRect = ref({});
    const objectValue = useControlsStore();
    let ungroupedSVG,
      ungroupedSVG1 = [];
    const p = ref(0);

    onMounted(() => {
      if (props.model.type === "piece") {
        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;
        const xOffset = 350 + (vw - 1500) / 2;
        const yOffset = 70 + (vh - 870) / 2;
        const svgElement = document.getElementById(
          `svgElement${props.model.id}`
        );
        const rect = svgElement.getBoundingClientRect();
        boundRect.value = rect;

        props.model.control[2].value =
          rect.width /
          props.model.control[8].value /
          props.model.control[9].value;
        props.model.control[3].value =
          rect.height /
          props.model.control[8].value /
          props.model.control[10].value;
        props.model.control[6].value =
          (rect.x - xOffset) /
            props.model.control[8].value /
            props.model.control[9].value -
          props.model.control[0].value /
            props.model.control[8].value /
            props.model.control[9].value;
        props.model.control[7].value =
          (rect.y - yOffset) /
            props.model.control[8].value /
            props.model.control[10].value -
          props.model.control[1].value /
            props.model.control[8].value /
            props.model.control[10].value;
      }
    });
    const clickMe = (type, payload, e) => {
      if (objectValue.penState === 0) {
        if (type === "rect") {
          if (props.model.control[9].value === 0) {
            ctx.emit("clickRect", ["rect", payload]);
          }
        } else if (type === "circle") {
          ctx.emit("clickCircle", ["circle", payload]);
        } else if (type === "text") {
          ctx.emit("clickText", ["text", payload]);
        } else if (type === "svg") {
          ctx.emit("clickSvg", ["svg", payload]);
        } else if (type === "pen") {
          ctx.emit("clickPen", ["pen", payload]);
        }
      }
    };

    const downMe = (type, payload, e) => {
      if (objectValue.penState === 0) {
        if (type === "rect") {
          if (props.model.control[9].value === 0) {
            ctx.emit("downRect", ["rect", payload, e]);
          } else {
            ctx.emit("multiRect", ["rect", payload, e]);
          }
        } else if (type === "circle") {
          if (props.model.control[7].value === 0) {
            ctx.emit("downCircle", ["circle", payload, e]);
          } else {
            ctx.emit("multiCircle", ["circle", payload, e]);
          }
        } else if (type === "text") {
          if (props.model.control[8].value === 0) {
            ctx.emit("downText", ["text", payload, e]);
          } else {
            ctx.emit("multiText", ["text", payload, e]);
          }
        } else if (type === "svg") {
          if (props.model.control[10].value === 0) {
            ctx.emit("downSvg", ["svg", payload, e]);
          } else {
            ctx.emit("multiSvg", ["svg", payload, e]);
          }
        } else if (type === "pen") {
          if (props.model.control[8].value === 0) {
            ctx.emit("downPen", ["pen", payload, e]);
          } else {
            ctx.emit("multiPen", ["pen", payload, e]);
          }
        } else if (type === "img") {
          if (props.model.control[8].value === 0) {
            ctx.emit("downImg", ["img", payload, e]);
          } else {
            ctx.emit("multiImg", ["img", payload, e]);
          }
        } else if (type === "piece") {
          if (props.model.control[11].value === 0) {
            ctx.emit("downPiece", ["piece", payload, e]);
          } else {
            ctx.emit("multiPiece", ["piece", payload, e]);
          }
        }
      }
    };

    const changeText = (type, e) => {
      if (type === "text") {
        props.model.control[2].value = e.target.value;
      }
    };
    const rectValues = ref({});
    const circleValues = ref({});
    const textValues = ref({});
    const svgValues = ref({});
    const textTemp = ref(0);
    if (props.model.type === "rect") {
      props.model.control.forEach((element) => {
        rectValues.value[element.label] = element.value;
      });
    } else if (props.model.type === "circle") {
      props.model.control.forEach((element) => {
        circleValues.value[element.label] = element.value;
      });
    } else if (props.model.type === "text") {
      props.model.control.forEach((element) => {
        textValues.value[element.label] = element.value;
      });
    } else if (props.model.type === "svg") {
      props.model.control.forEach((element) => {
        svgValues.value[element.label] = element.value;
      });
    }
    const pppppp = ref("");
    const focusOut = (type, payload, e) => {
      if (type === "text") {
        textTemp.value = 0;
        ctx.emit("focusOutText", ["text", payload, e.target.value]);
      }
    };
    const downSize = (type, payload, pos) => {
      if (type === "rect") {
        ctx.emit("downRectSize", ["rect", payload, pos]);
      }
      if (type === "circle") {
        ctx.emit("downCircleSize", ["circle", payload, pos]);
      }
      if (type === "text") {
        ctx.emit("downTextSize", ["text", payload, pos]);
      }
      if (type === "svg") {
        ctx.emit("downSvgSize", ["svg", payload, pos]);
      }
      if (type === "pen") {
        ctx.emit("downPenSize", ["pen", payload, pos]);
      }
      if (type === "img") {
        ctx.emit("downImgSize", ["img", payload, pos]);
      }
      if (type === "piece") {
        ctx.emit("downPieceSize", ["piece", payload, pos]);
      }
    };
    const upSize = (type, payload) => {
      if (type === "rect") {
        ctx.emit("upRectSize", ["rect", payload]);
      }
      if (type === "circle") {
        ctx.emit("upCircleSize", ["circle", payload]);
      }
      if (type === "text") {
        ctx.emit("upTextSize", ["text", payload]);
      }
      if (type === "svg") {
        ctx.emit("upSvgSize", ["svg", payload]);
      }
      if (type === "pen") {
        ctx.emit("upPenSize", ["pen", payload]);
      }
      if (type === "img") {
        ctx.emit("upImgSize", ["img", payload]);
      }
      if (type === "piece") {
        ctx.emit("upPieceSize", ["piece", payload]);
      }
    };

    function getTaskStatusIcon() {
      // if (p.value === 1) {
      return props.model.control[8].value;
      // }
    }
    // const getTaskStatusIcon = (status) => {
    //   return iconStatusMapping[status];
    // };

    return () => {
      return (
        <>
          {props.model.type === "piece" && (
            <>
              <g
                onClick={(e) => {
                  return clickMe(props.model.type, props.model.id, e);
                }}
                onMousedown={(e) => {
                  return downMe(props.model.type, props.model.id, e);
                }}
                transform={`scale(${
                  props.model.control[8].value * props.model.control[9].value
                },
                  ${
                    props.model.control[8].value * props.model.control[10].value
                  })`}
              >
                <rect
                  x={
                    props.model.control[0].value /
                      props.model.control[8].value /
                      props.model.control[9].value +
                    props.model.control[6].value
                  }
                  y={
                    props.model.control[1].value /
                      props.model.control[8].value /
                      props.model.control[10].value +
                    props.model.control[7].value
                  }
                  width={Math.abs(props.model.control[2].value)}
                  height={Math.abs(props.model.control[3].value)}
                  fill="#00000000"
                />
                <svg
                  id={`svgElement${props.model.id}`}
                  viewBox="0 0 1500 1500"
                  onMousedown={(e) => {
                    return downMe(props.model.type, props.model.id, e);
                  }}
                  x={
                    props.model.control[0].value /
                    props.model.control[8].value /
                    props.model.control[9].value
                  }
                  y={
                    props.model.control[1].value /
                    props.model.control[8].value /
                    props.model.control[10].value
                  }
                  v-html={props.model.control[5].value}
                ></svg>
                {props.model.state.isActive === true ? (
                  <>
                    <rect
                      x={
                        props.model.control[0].value /
                          props.model.control[8].value /
                          props.model.control[9].value +
                        props.model.control[6].value -
                        Math.abs(
                          10 /
                            props.model.control[8].value /
                            props.model.control[9].value
                        )
                      }
                      y={
                        props.model.control[1].value /
                          props.model.control[8].value /
                          props.model.control[10].value +
                        props.model.control[7].value -
                        Math.abs(
                          10 /
                            props.model.control[8].value /
                            props.model.control[10].value
                        )
                      }
                      width={
                        10 /
                        Math.abs(
                          props.model.control[8].value *
                            props.model.control[9].value
                        )
                      }
                      height={
                        10 /
                        Math.abs(
                          props.model.control[8].value *
                            props.model.control[10].value
                        )
                      }
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 1);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                    <rect
                      x={
                        props.model.control[0].value /
                          props.model.control[8].value /
                          props.model.control[9].value +
                        props.model.control[6].value +
                        props.model.control[2].value
                      }
                      y={
                        props.model.control[1].value /
                          props.model.control[8].value /
                          props.model.control[10].value +
                        props.model.control[7].value -
                        Math.abs(
                          10 /
                            props.model.control[8].value /
                            props.model.control[10].value
                        )
                      }
                      width={
                        10 /
                        Math.abs(
                          props.model.control[8].value *
                            props.model.control[9].value
                        )
                      }
                      height={
                        10 /
                        Math.abs(
                          props.model.control[8].value *
                            props.model.control[10].value
                        )
                      }
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 2);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                    <rect
                      x={
                        props.model.control[0].value /
                          props.model.control[8].value /
                          props.model.control[9].value +
                        props.model.control[6].value +
                        props.model.control[2].value
                      }
                      y={
                        props.model.control[1].value /
                          props.model.control[8].value /
                          props.model.control[10].value +
                        props.model.control[7].value +
                        props.model.control[3].value
                      }
                      width={10 / Math.abs(props.model.control[8].value)}
                      height={10 / Math.abs(props.model.control[8].value)}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 3);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                    <rect
                      x={
                        props.model.control[0].value /
                          props.model.control[8].value /
                          props.model.control[9].value +
                        props.model.control[6].value -
                        Math.abs(
                          10 /
                            props.model.control[8].value /
                            props.model.control[9].value
                        )
                      }
                      y={
                        props.model.control[1].value /
                          props.model.control[8].value /
                          props.model.control[10].value +
                        props.model.control[7].value +
                        props.model.control[3].value
                      }
                      width={10 / Math.abs(props.model.control[8].value)}
                      height={10 / Math.abs(props.model.control[8].value)}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 4);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                  </>
                ) : (
                  <></>
                )}
              </g>
            </>
          )}
          {props.model.type === "pen" && (
            <g
              onClick={(e) => {
                return clickMe(props.model.type, props.model.id, e);
              }}
              onMousedown={(e) => {
                return downMe(props.model.type, props.model.id, e);
              }}
              transform={`translate(${
                (-(
                  props.model.control[2].value + props.model.control[1].value
                ) /
                  2) *
                (props.model.control[5].value * props.model.control[6].value -
                  1)
              },${
                (-(
                  props.model.control[3].value + props.model.control[4].value
                ) /
                  2) *
                (props.model.control[5].value * props.model.control[7].value -
                  1)
              }) scale(${
                props.model.control[5].value * props.model.control[6].value
              }, ${
                props.model.control[5].value * props.model.control[7].value
              })`}
            >
              <rect
                x={Math.min(
                  props.model.control[1].value,
                  props.model.control[2].value
                )}
                y={Math.min(
                  props.model.control[3].value,
                  props.model.control[4].value
                )}
                width={Math.abs(
                  props.model.control[2].value - props.model.control[1].value
                )}
                height={Math.abs(
                  props.model.control[4].value - props.model.control[3].value
                )}
                fill="#00000000"
              />
              <path
                d={`M${props.model.control[0].value.flat().join(" ")}`}
                style={`fill: none; stroke: green; stroke-width: ${props.model.control[9].value}`}
                class={`${
                  props.model.state.isActive === true
                    ? "outline outline-sky-500 outline-2"
                    : ""
                }`}
              />
              {props.model.state.isActive === true ? (
                <>
                  <rect
                    x={props.model.control[1].value - 10}
                    y={props.model.control[3].value - 10}
                    width={10}
                    fill="#000000"
                    height={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 1);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  />
                  <rect
                    x={props.model.control[2].value}
                    y={props.model.control[3].value - 10}
                    width={10}
                    fill="#000000"
                    height={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 2);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  />
                  <rect
                    x={props.model.control[2].value}
                    y={props.model.control[4].value}
                    width={10}
                    fill="#000000"
                    height={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 3);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  />
                  <rect
                    x={props.model.control[1].value - 10}
                    y={props.model.control[4].value}
                    width={10}
                    fill="#000000"
                    height={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 4);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </g>
          )}
          {props.model.type === "img" && (
            <g
              onMousedown={(e) => {
                return downMe(props.model.type, props.model.id, e);
              }}
              transform={`scale(${
                props.model.control[4].value * props.model.control[5].value
              },${
                props.model.control[4].value * props.model.control[6].value
              })`}
            >
              <image
                id="img"
                x={
                  props.model.control[0].value /
                  props.model.control[4].value /
                  props.model.control[5].value
                }
                y={
                  props.model.control[1].value /
                  props.model.control[4].value /
                  props.model.control[6].value
                }
                href={props.model.control[7].value}
                width={300}
              />
              {props.model.state.isActive ? (
                <>
                  <rect
                    x={
                      props.model.control[0].value /
                        props.model.control[4].value /
                        props.model.control[5].value -
                      Math.abs(
                        10 /
                          props.model.control[4].value /
                          props.model.control[5].value
                      )
                    }
                    y={
                      props.model.control[1].value /
                        props.model.control[4].value /
                        props.model.control[6].value -
                      Math.abs(
                        10 /
                          props.model.control[4].value /
                          props.model.control[6].value
                      )
                    }
                    width={10 / Math.abs(props.model.control[4].value)}
                    height={10 / Math.abs(props.model.control[4].value)}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 1);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  ></rect>
                  <rect
                    x={
                      props.model.control[0].value /
                        props.model.control[4].value /
                        props.model.control[5].value +
                      300
                    }
                    y={
                      props.model.control[1].value /
                        props.model.control[4].value /
                        props.model.control[6].value -
                      Math.abs(
                        10 /
                          props.model.control[4].value /
                          props.model.control[6].value
                      )
                    }
                    width={10 / Math.abs(props.model.control[4].value)}
                    height={10 / Math.abs(props.model.control[4].value)}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 2);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  ></rect>
                  <rect
                    x={
                      props.model.control[0].value /
                        props.model.control[4].value /
                        props.model.control[5].value +
                      300
                    }
                    y={
                      props.model.control[1].value /
                        props.model.control[4].value /
                        props.model.control[6].value +
                      (300 * props.model.control[3].value) /
                        props.model.control[2].value
                    }
                    width={10 / Math.abs(props.model.control[4].value)}
                    height={10 / Math.abs(props.model.control[4].value)}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 3);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  ></rect>
                  <rect
                    x={
                      props.model.control[0].value /
                        props.model.control[4].value /
                        props.model.control[5].value -
                      Math.abs(
                        10 /
                          props.model.control[4].value /
                          props.model.control[5].value
                      )
                    }
                    y={
                      props.model.control[1].value /
                        props.model.control[4].value /
                        props.model.control[6].value +
                      (300 * props.model.control[3].value) /
                        props.model.control[2].value
                    }
                    width={10 / Math.abs(props.model.control[4].value)}
                    height={10 / Math.abs(props.model.control[4].value)}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 4);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                  ></rect>
                </>
              ) : (
                <></>
              )}
            </g>
          )}
          {props.model.type === "svg" && (
            <>
              <g
                onClick={(e) => {
                  return clickMe(props.model.type, props.model.id, e);
                }}
                onMousedown={(e) => {
                  return downMe(props.model.type, props.model.id, e);
                }}
                transform={` scale(${
                  props.model.control[7].value * props.model.control[6].value
                }, ${
                  props.model.control[9].value * props.model.control[6].value
                })`}
              >
                <svg
                  x={
                    (props.model.control[0].value * 1) /
                    props.model.control[6].value /
                    props.model.control[7].value
                  }
                  y={
                    props.model.control[1].value /
                    props.model.control[6].value /
                    props.model.control[9].value
                  }
                  v-html={props.model.control[8].value}
                ></svg>
                {ungroupedSVG1.map((sss) => {
                  return (
                    <svg
                      viewBox="0 0 1500 1500"
                      x="0"
                      y="0"
                      transform={` scale(${
                        props.model.control[7].value *
                        props.model.control[6].value
                      }, ${
                        props.model.control[9].value *
                        props.model.control[6].value
                      })`}
                      v-html={sss}
                    ></svg>
                  );
                })}

                {props.model.state.isActive ? (
                  <>
                    <foreignObject
                      x={
                        (props.model.control[0].value * 1) /
                        props.model.control[6].value /
                        props.model.control[7].value
                      }
                      y={
                        (props.model.control[1].value * 1) /
                        props.model.control[6].value /
                        props.model.control[9].value
                      }
                      width={10 / Math.abs(props.model.control[6].value)}
                      height={20 / Math.abs(props.model.control[6].value)}
                    >
                      <button
                        class={`text-black bg-slate-800 cursor-se-resize`}
                        style={{
                          minWidth: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                          minHeight: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                        }}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 1);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={
                        (props.model.control[0].value * 1) /
                          props.model.control[6].value /
                          props.model.control[7].value +
                        800
                      }
                      y={
                        (props.model.control[1].value * 1) /
                        props.model.control[6].value /
                        props.model.control[9].value
                      }
                      width={10 / Math.abs(props.model.control[6].value)}
                      height={20 / Math.abs(props.model.control[6].value)}
                    >
                      <button
                        class={`text-black bg-slate-800 cursor-ne-resize`}
                        style={{
                          minWidth: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                          minHeight: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                        }}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 2);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={
                        (props.model.control[0].value * 1) /
                          props.model.control[6].value /
                          props.model.control[7].value +
                        800
                      }
                      y={
                        (props.model.control[1].value * 1) /
                          props.model.control[6].value /
                          props.model.control[9].value +
                        800
                      }
                      width={10 / Math.abs(props.model.control[6].value)}
                      height={20 / Math.abs(props.model.control[6].value)}
                    >
                      <button
                        class={`text-black bg-slate-800 cursor-se-resize`}
                        style={{
                          minWidth: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                          minHeight: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                        }}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 3);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={
                        (props.model.control[0].value * 1) /
                        props.model.control[6].value /
                        props.model.control[7].value
                      }
                      y={
                        (props.model.control[1].value * 1) /
                          props.model.control[6].value /
                          props.model.control[9].value +
                        800
                      }
                      width={10 / Math.abs(props.model.control[6].value)}
                      height={20 / Math.abs(props.model.control[6].value)}
                    >
                      <button
                        class={`text-black bg-slate-800 cursor-se-resize`}
                        style={{
                          minWidth: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                          minHeight: `${
                            10 / Math.abs(props.model.control[6].value)
                          }px`,
                        }}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 4);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                  </>
                ) : (
                  <></>
                )}
              </g>
              <svg x={100} y={100}>
                {props.model.control[8].value
                  .split("g")
                  .map((stringtemp, index) => {
                    {
                      stringtemp;
                    }
                  })}
              </svg>
            </>
          )}
          {props.model.type === "rect" && (
            <g>
              <rect
                onClick={(e) => {
                  return clickMe(props.model.type, props.model.id, e);
                }}
                onMousedown={(e) => {
                  return downMe(props.model.type, props.model.id, e);
                }}
                x={props.model.control[0].value}
                y={props.model.control[1].value}
                width={props.model.control[2].value}
                height={props.model.control[3].value}
                fill={props.model.control[4].value}
                transform={`translate(${
                  -props.model.control[0].value *
                  (props.model.control[5].value * props.model.control[7].value -
                    1)
                },${
                  -props.model.control[1].value *
                  (props.model.control[6].value * props.model.control[8].value -
                    1)
                }) scale(${
                  props.model.control[5].value * props.model.control[7].value
                },${
                  props.model.control[6].value * props.model.control[8].value
                })`}
                // scale={props.model.control[5].value}
              />
              {props.model.state.isActive ? (
                <>
                  <rect
                    x={props.model.control[0].value - 3}
                    y={props.model.control[1].value - 7}
                    width={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 1);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                    fill="#000000"
                    class={`${
                      props.model.control[5].value *
                        props.model.control[6].value *
                        props.model.control[7].value >=
                      0
                        ? "cursor-se-resize"
                        : "cursor-ne-resize"
                    }`}
                    height={10}
                  />
                  <rect
                    x={
                      props.model.control[0].value +
                      props.model.control[2].value *
                        props.model.control[7].value *
                        props.model.control[5].value -
                      3
                    }
                    y={props.model.control[1].value - 7}
                    width={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 2);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                    fill="#000000"
                    class={`${
                      props.model.control[5].value *
                        props.model.control[6].value *
                        props.model.control[7].value >=
                      0
                        ? "cursor-ne-resize"
                        : "cursor-se-resize"
                    }`}
                    height={10}
                  />
                  <rect
                    x={
                      props.model.control[0].value +
                      props.model.control[2].value *
                        props.model.control[7].value *
                        props.model.control[5].value -
                      3
                    }
                    y={
                      props.model.control[1].value +
                      props.model.control[3].value *
                        props.model.control[6].value *
                        props.model.control[8].value -
                      7
                    }
                    width={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 3);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                    fill="#000000"
                    class={`${
                      props.model.control[5].value *
                        props.model.control[6].value *
                        props.model.control[7].value >=
                      0
                        ? "cursor-se-resize"
                        : "cursor-ne-resize"
                    }`}
                    height={10}
                  />
                  <rect
                    x={props.model.control[0].value - 3}
                    y={
                      props.model.control[1].value +
                      props.model.control[3].value *
                        props.model.control[6].value *
                        props.model.control[8].value -
                      7
                    }
                    width={10}
                    onMousedown={() => {
                      return downSize(props.model.type, props.model.id, 4);
                    }}
                    onMouseup={() => {
                      return upSize(props.model.type, props.model.id);
                    }}
                    fill="#000000"
                    class={` ${
                      props.model.control[5].value *
                        props.model.control[6].value *
                        props.model.control[7].value >=
                      0
                        ? "cursor-ne-resize"
                        : "cursor-se-resize"
                    }`}
                    height={10}
                  />
                </>
              ) : (
                <></>
              )}
            </g>
          )}
          {props.model.type === "circle" && (
            <g>
              <circle
                onClick={(e) => {
                  return clickMe(props.model.type, props.model.id, e);
                }}
                onMousedown={(e) => {
                  return downMe(props.model.type, props.model.id, e);
                }}
                cx={props.model.control[0].value}
                cy={props.model.control[1].value}
                r={props.model.control[2].value}
                fill={props.model.control[3].value}
                transform={`translate(${
                  -props.model.control[0].value *
                  (props.model.control[4].value * props.model.control[5].value -
                    1)
                },${
                  -props.model.control[1].value *
                  (props.model.control[4].value - 1)
                }) scale(${
                  props.model.control[4].value * props.model.control[5].value
                },${props.model.control[4].value})`}
              />
              {props.model.state.isActive ? (
                <>
                  <foreignObject
                    x={
                      props.model.control[0].value -
                      props.model.control[2].value *
                        props.model.control[4].value *
                        props.model.control[5].value -
                      5
                    }
                    y={
                      props.model.control[1].value -
                      props.model.control[2].value *
                        props.model.control[4].value -
                      15
                    }
                    width={10}
                    height={20}
                  >
                    <button
                      class={`text-black bg-slate-800 w-[10px] h-[10px] ${
                        props.model.control[4].value *
                          props.model.control[4].value >=
                        0
                          ? "cursor-se-resize"
                          : "cursor-ne-resize"
                      }`}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 1);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                  </foreignObject>
                  <foreignObject
                    x={
                      props.model.control[0].value +
                      props.model.control[2].value *
                        props.model.control[4].value *
                        props.model.control[5].value -
                      5
                    }
                    y={
                      props.model.control[1].value -
                      props.model.control[2].value *
                        props.model.control[4].value -
                      15
                    }
                    width={10}
                    height={20}
                  >
                    <button
                      class={`text-black bg-slate-800 w-[10px] h-[10px] cursor-ne-resize`}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 2);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                  </foreignObject>
                  <foreignObject
                    x={
                      props.model.control[0].value +
                      props.model.control[2].value *
                        props.model.control[4].value *
                        props.model.control[5].value -
                      5
                    }
                    y={
                      props.model.control[1].value +
                      props.model.control[2].value *
                        props.model.control[4].value -
                      15
                    }
                    width={10}
                    height={20}
                  >
                    <button
                      class={`text-black bg-slate-800 w-[10px] h-[10px] ${
                        props.model.control[4].value *
                          props.model.control[4].value >=
                        0
                          ? "cursor-se-resize"
                          : "cursor-ne-resize"
                      }`}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 3);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                  </foreignObject>
                  <foreignObject
                    x={
                      props.model.control[0].value -
                      props.model.control[2].value *
                        props.model.control[4].value *
                        props.model.control[5].value -
                      5
                    }
                    y={
                      props.model.control[1].value +
                      props.model.control[2].value *
                        props.model.control[4].value -
                      15
                    }
                    width={10}
                    height={20}
                  >
                    <button
                      class={`text-black bg-slate-800 w-[10px] h-[10px] cursor-ne-resize`}
                      onMousedown={() => {
                        return downSize(props.model.type, props.model.id, 4);
                      }}
                      onMouseup={() => {
                        return upSize(props.model.type, props.model.id);
                      }}
                    />
                  </foreignObject>
                </>
              ) : (
                <></>
              )}
            </g>
          )}
          {props.model.type === "text" &&
            (textTemp.value === 0 ? (
              <g
                onClick={(e) => {
                  return clickMe(props.model.type, props.model.id, e);
                }}
                onMousedown={(e) => {
                  return downMe(props.model.type, props.model.id, e);
                }}
                x={props.model.control[0].value}
                y={props.model.control[1].value}
                transform={`translate(${
                  -props.model.control[0].value *
                  (props.model.control[4].value * props.model.control[6].value -
                    1)
                },${
                  -props.model.control[1].value *
                  (props.model.control[4].value * props.model.control[7].value -
                    1)
                }) scale(${
                  props.model.control[4].value * props.model.control[6].value
                },${
                  props.model.control[4].value * props.model.control[7].value
                })`}
              >
                <rect
                  x={props.model.control[0].value}
                  y={props.model.control[1].value - 30}
                  width={
                    (props.model.control[2].value.length *
                      props.model.control[5].value *
                      props.model.control[9].value) /
                    80
                  }
                  height={(props.model.control[9].value / 80) * 64}
                  fill="#00000000"
                />
                <text
                  id={`text${props.model.id}`}
                  x={props.model.control[0].value}
                  y={props.model.control[1].value}
                  onDblclick={() => {
                    textTemp.value = 1;
                  }}
                  textLength={
                    (props.model.control[2].value.length *
                      props.model.control[5].value *
                      props.model.control[9].value) /
                    80
                  }
                  stroke={props.model.control[11].value}
                  stroke-width={props.model.control[12].value}
                  font-size={props.model.control[9].value}
                  fill={props.model.control[3].value}
                  class={`${
                    props.model.control[13].value[0] ? "font-bold" : ""
                  } ${props.model.control[13].value[2] ? "italic" : ""}
                   ${
                     props.model.control[13].value[1] &&
                     props.model.control[13].value[3]
                       ? "[text-decoration:underline_line-through]"
                       : props.model.control[13].value[3]
                       ? "line-through"
                       : props.model.control[13].value[1]
                       ? "underline"
                       : ""
                   }`}
                  style={{
                    fontFamily: `${props.model.control[10].value}`,
                    userSelect: "none",
                  }}
                >
                  {props.model.control[2].value}
                </text>
                {props.model.state.isActive ? (
                  <>
                    <foreignObject
                      x={props.model.control[0].value - 20}
                      y={
                        props.model.control[1].value -
                        30 -
                        (props.model.control[9].value / 80) * 64
                      }
                      style={{ borderColor: "#00000000" }}
                      class="border-8 p-0 m-0"
                      width={25}
                      height={35}
                    >
                      <div
                        class={`DragButton w-[10px] h-[10px] p-0 m-0`}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 1);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={
                        props.model.control[0].value +
                        (props.model.control[2].value.length *
                          props.model.control[5].value *
                          props.model.control[9].value) /
                          80
                      }
                      y={
                        props.model.control[1].value -
                        30 -
                        (props.model.control[9].value / 80) * 64
                      }
                      style={{ borderColor: "#00000000" }}
                      class="border-8 p-0 m-0"
                      width={25}
                      height={35}
                    >
                      <div
                        class={`DragButton w-[10px] h-[10px] p-0 m-0`}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 2);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={
                        props.model.control[0].value +
                        (props.model.control[2].value.length *
                          props.model.control[5].value *
                          props.model.control[9].value) /
                          80
                      }
                      y={props.model.control[1].value}
                      style={{ borderColor: "#00000000" }}
                      class="border-8 p-0 m-0"
                      width={25}
                      height={35}
                    >
                      <div
                        class={`DragButton w-[10px] h-[10px] p-0 m-0`}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 3);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                    <foreignObject
                      x={props.model.control[0].value - 20}
                      y={props.model.control[1].value}
                      style={{ borderColor: "#00000000" }}
                      class="border-8 p-0 m-0"
                      width={25}
                      height={35}
                    >
                      <div
                        class={`DragButton w-[10px] h-[10px] p-0 m-0`}
                        onMousedown={() => {
                          return downSize(props.model.type, props.model.id, 4);
                        }}
                        onMouseup={() => {
                          return upSize(props.model.type, props.model.id);
                        }}
                      />
                    </foreignObject>
                  </>
                ) : (
                  <></>
                )}
              </g>
            ) : (
              <foreignObject
                x={props.model.control[0].value - 20}
                y={props.model.control[1].value - 80}
                transform={`translate(${
                  -props.model.control[0].value *
                  (props.model.control[4].value * props.model.control[6].value -
                    1)
                },${
                  -props.model.control[1].value *
                  (props.model.control[4].value * props.model.control[7].value -
                    1)
                }) scale(${
                  props.model.control[4].value * props.model.control[6].value
                },${
                  props.model.control[4].value * props.model.control[7].value
                })`}
                fill={props.model.control[3].value}
                width="10000"
                height="300"
              >
                <input
                  type="text"
                  value={props.model.control[2].value}
                  style={{
                    width: "100000px",
                    fontSize: "60px",
                    backgroundColor: "rgba(255,255,255,0)",
                    color: "#000",
                    outline: "none",
                  }}
                  onChange={(e) => {
                    return changeText(props.model.type, e);
                  }}
                  onFocusout={(e) => {
                    return focusOut(props.model.type, props.model.id, e);
                  }}
                />
              </foreignObject>
            ))}
        </>
      );
    };
  },
  {
    props: {
      model: Object,
    },
    emits: [
      "clickRect",
      "clickCircle",
      "clickText",
      "clickSvg",
      "clickPen",
      "downRect",
      "downCircle",
      "downText",
      "focusOutText",
      "downSvg",
      "downPen",
      "downImg",
      "downRectSize",
      "downCircleSize",
      "upRectSize",
      "upCircleSize",
      "downTextSize",
      "downSvgSize",
      "downPenSize",
      "upTextSize",
      "upSvgSize",
      "upPenSize",
      "multiRect",
      "multiCircle",
      "multiText",
      "multiSvg",
      "multiPen",
      "multiImg",
      "downImgSize",
      "upImgSize",
      "downPieceSize",
      "upPieceSize",
      "downPiece",
      "multiPiece",
    ],
  }
);
