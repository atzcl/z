type ExtendInterface<T> = {
  [P in keyof T]: T[P];
}
