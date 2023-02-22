export interface UpdateData {
  actionId: string;
  newData: Record<number, string>;
}

export interface CurrencyData {
  from_chain_price: string;
  to_chain_price: string;
  from_chain_decimal: string;
  to_chain_decimal: string;
}

export interface UpdateGroupKey {
  groupKey: number[];
  actionId: string;
}
