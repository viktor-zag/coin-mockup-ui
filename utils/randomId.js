export default function randomId() {
  return (
    Math.random() * (100).toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
