const actionEmitter = (type: string) => (payload: object | string | number) => {
  const ret: any = { type };
  if (payload != null) {
    ret.payload = payload;
  }
  return ret;
};

export default actionEmitter;