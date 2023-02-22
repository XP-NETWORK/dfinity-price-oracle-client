/* eslint-disable */
//@ts-ignore
export const idlFactory = ({ IDL }) => {
  const UpdatePrice = IDL.Record({
    new_data: IDL.Vec(IDL.Tuple(IDL.Nat16, IDL.Nat)),
  });
  const BridgeAction = IDL.Record({
    action_id: IDL.Nat,
    inner: UpdatePrice,
  });
  const UpdateGroupKey = IDL.Record({ gk: IDL.Vec(IDL.Nat8) });
  /* eslint-disable camelcase */
  const BridgeAction_1 = IDL.Record({
    action_id: IDL.Nat,
    inner: UpdateGroupKey,
  });
  return IDL.Service({
    estimate_gas: IDL.Func(
      [IDL.Nat16, IDL.Nat16],
      [IDL.Opt(IDL.Nat)],
      ['query']
    ),
    get_decimal_data: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat16, IDL.Nat))],
      ['query']
    ),
    get_group_key: IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    get_other_fee_data: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat16, IDL.Nat))],
      ['query']
    ),
    get_price_data: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat16, IDL.Nat))],
      ['query']
    ),
    get_tx_fee_data: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat16, IDL.Nat))],
      ['query']
    ),
    validate_update_decimal: IDL.Func(
      [BridgeAction, IDL.Vec(IDL.Nat8)],
      [],
      []
    ),
    validate_update_group_key: IDL.Func(
      [BridgeAction_1, IDL.Vec(IDL.Nat8)],
      [],
      []
    ),
    validate_update_other_fee: IDL.Func(
      [BridgeAction, IDL.Vec(IDL.Nat8)],
      [],
      []
    ),
    validate_update_price: IDL.Func([BridgeAction, IDL.Vec(IDL.Nat8)], [], []),
    validate_update_tx_fee: IDL.Func([BridgeAction, IDL.Vec(IDL.Nat8)], [], []),
  });
};
//@ts-ignore 
export const OracleIDL = ({ IDL }) => {
  return [IDL.Vec(IDL.Nat8)];
};


import { ActorMethod } from '@dfinity/agent';

export interface BridgeAction {
  action_id: bigint;
  inner: UpdatePrice;
}
export interface BridgeAction_1 {
  action_id: bigint;
  inner: UpdateGroupKey;
}
export interface UpdateGroupKey {
  gk: number[];
}
export interface UpdatePrice {
  new_data: Array<[number, bigint]>;
}
export interface _SERVICE {
  estimate_gas: ActorMethod<[number, number], [] | [bigint]>;
  get_decimal_data: ActorMethod<[], Array<[number, bigint]>>;
  get_group_key: ActorMethod<[], number[]>;
  get_other_fee_data: ActorMethod<[], Array<[number, bigint]>>;
  get_price_data: ActorMethod<[], Array<[number, bigint]>>;
  get_tx_fee_data: ActorMethod<[], Array<[number, bigint]>>;
  validate_update_decimal: ActorMethod<[BridgeAction, number[]], undefined>;
  validate_update_group_key: ActorMethod<[BridgeAction_1, number[]], undefined>;
  validate_update_other_fee: ActorMethod<[BridgeAction, number[]], undefined>;
  validate_update_price: ActorMethod<[BridgeAction, number[]], undefined>;
  validate_update_tx_fee: ActorMethod<[BridgeAction, number[]], undefined>;
}
