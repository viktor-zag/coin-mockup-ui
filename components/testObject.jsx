export default defineComponent({
  props: {
    model: Object,
  },
  render: (props) => {
    return (
      <>
        {props.model.type === "circle" && (
          <circle r="20" cx={props.model.cx} cy="50" fill={props.model.color} />
        )}
        {props.model.type === "rect" && (
          <rect width="20" height="10" x="45" y="50" fill="blue" />
        )}
      </>
    );
  },
});

// export default defineComponent({
//     props: {
//         model: Object
//     },
//     render: () => {
//         return (
//             <>
//             {props.model.type === "circle" ? <circle r="20" cx={props.model.cx} cy="50" fill={props.model.color} />}
//             </>
//         )
//     }
// })

// export default defineComponent({
//     props: {
//       message: String
//     },
//     render: (props) => {
//       return (
//       <div>
//         { props.message }
//       </div>
//       )
//     }
//   })
