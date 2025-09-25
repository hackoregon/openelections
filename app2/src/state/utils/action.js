export default function action(type, payload = {}) {
  return { type, ...payload };
}
