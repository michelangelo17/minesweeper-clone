export enum cellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb,
}

export enum cellState {
  open,
  visible,
  flagged,
}

export type cell = { value: cellValue; state: cellState }
