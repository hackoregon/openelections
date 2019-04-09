const actionEmitter = (type: any) => (payload: any) => {
  const ret = { type };
  if (payload != null) {
    ret[payload] = payload;
  }
  return ret;
};

export default actionEmitter;