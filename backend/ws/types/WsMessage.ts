export type WsMessage<T = unknown> = {
  type: string;
  payload?: T;
};
