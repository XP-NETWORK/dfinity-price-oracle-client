import { CurrencyData, UpdateGroupKey, UpdateData } from './types';
import { Actor, HttpAgent } from '@dfinity/agent';
import { BridgeAction, OracleIDL, _SERVICE } from './agent/idl';
import { encode } from '@dfinity/agent/lib/cjs/cbor';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';

export interface PayConvOracle {
  /** Initialize the oracle with the initial data. This function should only be called once per contract.
   * @argument groupKey - The group key for the oracle. This is used to verify signatures.
   * @argument decimals - The decimals for each currency. This is used to convert the price data to a fixed point number. The key is the chain nonce and the value is the number of decimals in power of 10 (ie 1e18).
   * @argument initialPriceData - The initial price data for the oracle. The key is the chain nonce and the value is the price in their decimal multiplied form.
   * @argument txFeeData - The transaction fee data for the oracle. The key is the chain nonce and the value is the fee ( gas Fee * gas Price) in their decimal multiplied form.
   * @argument otherFees - The other fees for the oracle. The key is the chain nonce and the value is the fee in their decimal multiplied form. for futureproofing and increasing the flexibility of the oracle.
   * @returns The transaction hash of the initialize function call.
   * @memberof PayConvOracle
   */
  initialize: (
    groupKey: number[],
    decimals: Record<number, string>,
    initialPriceData: Record<number, string>,
    txFeeData: Record<number, string>,
    otherFees: Record<number, string>
  ) => Promise<string>;
  /**
   * Update the price data for the oracle. This function requires multisig signatures.
   * @argument data The data to update the price data. The key is the chain nonce and the value is the price in their decimal multiplied form.
   * @argument sigData The signature data for the update. This is the signature of the hash of the action id and the data. THe signature is generated using FROST Multisig.
   * @memberof PayConvOracle
   */
  validateUpdatePrices: (
    data: UpdateData,
    sigData: number[]
  ) => Promise<string>;
  /**
   * Updates the decimal data . This function requires multisig signatures.
   * @argument data The data to update the decima data. The key is the chain nonce and the value is decimal in power of ten form (ie 1e18).
   * @argument sigData The signature data for the update. This is the signature of the hash of the action id and the data. THe signature is generated using FROST Multisig.
   * @memberof PayConvOracle
   */
  validateUpdateDecimals: (
    data: UpdateData,
    sigData: number[]
  ) => Promise<string>;

  /**
   * Updates the transaction fees data . This function requires multisig signatures.
   * @argument data The data to update the tx fees data.
   * @argument sigData The signature data for the update. This is the signature of the hash of the action id and the data. THe signature is generated using FROST Multisig.
   * @memberof PayConvOracle
   */
  validateUpdateTxFees: (
    data: UpdateData,
    sigData: number[]
  ) => Promise<string>;

  /**
   * Updates the miscellaneous fees data on some chains, for future proofing . This function requires multisig signatures.
   * @argument data The data to update the tx fees data.
   * @argument sigData The signature data for the update. This is the signature of the hash of the action id and the data. THe signature is generated using FROST Multisig.
   * @memberof PayConvOracle
   */
  validateUpdateOtherFees: (
    data: UpdateData,
    sigData: number[]
  ) => Promise<string>;
  /**
   * Get the price data for the given chain nonces.
   * @argument fromNonce The nonce of the from chain.
   * @argument toNonce The nonce of the departure chain.
   * @returns {Record<number, string>} The price data for the given chain nonces.
   * @memberof PayConvOracle
   */
  getPriceData: (
    fromNonce: number,
    toNonce: number
  ) => Promise<Record<number, number>>;
  /**
   * Get the decimal data for the given chain nonces.
   * @argument fromNonce The nonce of the from chain.
   * @argument toNonce The nonce of the departure chain.
   * @returns {Record<number, string>} The price data for the given chain nonces.
   * @memberof PayConvOracle
   */
  getDecimalData: (
    fromNonce: number,
    toNonce: number
  ) => Promise<Record<string, string>>;
  /**
   * Encode the update data for so that it can be signed and then sent to the contract.
   * Required for updating the data on the oracle.
   * @argument data The data to be encoded
   * @argument actionId The action id for the update. must be unique
   * @returns {number[]} The encoded data
   * @memberof PayConvOracle
   */
  encodeUpdateData: (
    data: Record<number, string>,
    actionId: string
  ) => Promise<number[]>;
  /**
   * Encode the update group key data for so that it can be signed and then sent to the contract.
   * Required for updating the group key.
   * @argument groupKey The new group key to be set
   * @argument actionId The action id for the update. must be unique
   * @returns {number[]} The encoded data
   * @memberof PayConvOracle
   */
  encodeUpdateGroupKey: (
    groupKey: number[],
    actionId: string
  ) => Promise<number[]>;
  /**
   * Update the group key for the oracle. This function requires multisig signatures.
   * @argument data The data to update the group key in the state of the contract.
   * @argument sigData The signature data for the update. This is the signature of the hash of the action id and the data. THe signature is generated using FROST Multisig.
   * @memberof PayConvOracle
   */
  validateUpdateGroupKey: (
    data: UpdateGroupKey,
    sigData: number[]
  ) => Promise<string>;
  /**
   * Gets the currency Data for the given chain nonces.
   * @argument fromNonce The nonce of the from chain.
   * @argument toNonce The nonce of the to chain.
   * @returns {CurrencyData} The currency data for the given chain nonces.
   * @memberof PayConvOracle
   */
  getCurrencyData: (
    fromNonce: number,
    toNonce: number
  ) => Promise<CurrencyData>;
  /**
   * Gets the group key from the oracle.
   * @memberof PayConvOracle
   */
  getGroupKey: () => Promise<number[]>;
  /**
   * Gets all the price data from the oracle.
   * @memberof PayConvOracle
   */
  getAllPriceData: () => Promise<Record<string, string>>;
  /**
   * Gets all the decimal data from the oracle.
   * @memberof PayConvOracle
   */
  getAllDecimalData: () => Promise<Record<string, string>>;
  /**
   * Estimate the fees for the given chain nonces using the data inside the oracle.
   * @memberof PayConvOracle
   */
  estimateFees: (from: number, to: number) => Promise<string>;
}

export const CreateDfinityPayConvClient = async (
  conn: string,
  signerId: string,
  canisterId: string
): Promise<PayConvOracle> => {
  // Generating a signer object
  const wallet = Secp256k1KeyIdentity.fromSecretKey(
    Buffer.from(signerId, 'hex')
  );

  const agent = new HttpAgent({
    host: conn,
    identity: wallet as any,
  });
  const actor = Actor.createActor<_SERVICE>(OracleIDL, {
    canisterId,
    agent,
  });

  return {
    async getPriceData() {
      throw new Error(`Not implemented for this chan`);
    },
    async getAllDecimalData() {
      const result = await actor.get_decimal_data();
      const transformedResult: Array<[number, string]> = result.map(
        ([nonce, decimal]) => {
          return [nonce, decimal.toString()];
        }
      );
      return Object.fromEntries(transformedResult);
    },
    async estimateFees(from, to) {
      const result = await actor.estimate_gas(from, to);
      if (typeof result[0] === 'bigint') {
        return result.toString();
      } else {
        throw new Error(`No Data Found`);
      }
    },
    async getCurrencyData() {
      throw new Error(`Not implemented for this chan`);
    },
    async getAllPriceData() {
      const result = await actor.get_price_data();
      const transformedResult: Array<[number, string]> = result.map(
        ([nonce, decimal]) => {
          return [nonce, decimal.toString()];
        }
      );
      return Object.fromEntries(transformedResult);
    },
    async encodeUpdateGroupKey() {
      throw new Error(`Not yet implemented!`);
    },
    async validateUpdateGroupKey(data, sigData) {
      await actor.validate_update_group_key(
        {
          action_id: BigInt(data.actionId),
          inner: { gk: data.groupKey },
        },
        sigData
      );
      return `Result`;
    },
    async validateUpdateOtherFees(data, sigData) {
      const entries = Object.entries(data.newData);
      const mapped: Array<[number, bigint]> = entries.map(e => [
        Number(e[0]),
        BigInt(e[1]),
      ]);
      await actor.validate_update_other_fee(
        {
          action_id: BigInt(data.actionId),
          inner: { new_data: mapped },
        },
        sigData
      );
      return `Result`;
    },
    async validateUpdateTxFees(data, sigData) {
      const entries = Object.entries(data.newData);
      const mapped: Array<[number, bigint]> = entries.map(e => [
        Number(e[0]),
        BigInt(e[1]),
      ]);
      await actor.validate_update_tx_fee(
        {
          action_id: BigInt(data.actionId),
          inner: { new_data: mapped },
        },
        sigData
      );
      return `Result`;
    },
    async getGroupKey() {
      const result = await actor.get_group_key();
      return result;
    },
    async getDecimalData() {
      throw new Error(`Not yet implemented!`);
    },
    async initialize() {
      throw new Error(`Not yet implemented!`);
    },
    async encodeUpdateData(data, actionId) {
      const newData: Array<[number, bigint]> = Object.entries(data).map(
        ([nonce, value]) => {
          return [Number(nonce), BigInt(value)];
        }
      );
      const encodeIt: BridgeAction = {
        action_id: BigInt(actionId),
        inner: {
          new_data: newData,
        },
      };
      const encoded = encode(encodeIt);
      return [...Buffer.from(encoded)];
    },
    async validateUpdateDecimals(data, sigData) {
      const entries = Object.entries(data.newData);
      const mapped: Array<[number, bigint]> = entries.map(e => [
        Number(e[0]),
        BigInt(e[1]),
      ]);
      await actor.validate_update_decimal(
        {
          action_id: BigInt(data.actionId),
          inner: { new_data: mapped },
        },
        sigData
      );
      return `Result`;
    },
    async validateUpdatePrices(data, sigData) {
      const entries = Object.entries(data.newData);
      const mapped: Array<[number, bigint]> = entries.map(e => [
        Number(e[0]),
        BigInt(e[1]),
      ]);
      await actor.validate_update_price(
        {
          action_id: BigInt(data.actionId),
          inner: { new_data: mapped },
        },
        sigData
      );
      return `Result`;
    },
  };
};
