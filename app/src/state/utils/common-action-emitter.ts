const actionEmitter = (type: any) => (payload: any) => {
  const ret: any = { type };
  if (payload != null) {
    ret.payload = payload;
  }
  return ret;
};

export default actionEmitter;