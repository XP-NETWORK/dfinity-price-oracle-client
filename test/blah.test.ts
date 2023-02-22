// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { connect, InMemorySigner, KeyPair, keyStores, Near } from 'near-api-js';
// import { CreatePayConvClient, PayConvOracle } from '../src';
// import { createHash } from 'crypto';
// import * as ed from '@noble/ed25519';
// import { config } from 'dotenv';

// config();

// jest.setTimeout(1000000);

// describe('blah', () => {
//   const keyStore = new keyStores.InMemoryKeyStore();
//   const kp = KeyPair.fromString(process.env.PRIVATE_KEY!);

//   const signer = new InMemorySigner(keyStore);

//   let near: Near;
//   let client: PayConvOracle;
//   let privateKey: Uint8Array;
//   let groupKey: Uint8Array;

//   beforeAll(async () => {
//     privateKey = ed.utils.randomPrivateKey();
//     groupKey = await ed.getPublicKey(privateKey);
//     await keyStore.setKey(process.env.NETWORK_ID!, process.env.ACCOUNT_ID!, kp);

//     console.log({
//       privateKey: Buffer.from(privateKey).toString('hex'),
//       groupKey: Buffer.from(groupKey).toString('hex'),
//     });

//     near = await connect({
//       networkId: process.env.NETWORK_ID!,
//       nodeUrl: process.env.RPC!,
//       signer,
//     });
//     privateKey = ed.utils.randomPrivateKey();
//     groupKey = await ed.getPublicKey(privateKey);

//     client = await CreatePayConvClient(
//       near,
//       process.env.ACCOUNT_ID!,
//       process.env.ACCOUNT_ID!
//     );
//   });

//   it('test initialize', async () => {
//     const init = await client.initialize(
//       [...groupKey],
//       {
//         2: (1e18).toString(),
//         4: (1e18).toString(),
//         31: '1000000000000000000000000',
//       },
//       {
//         2: '33462047389993755000',
//         4: '243714368156785970000',
//         31: '1318027190036400407838720',
//       },
//       {
//         2: '100000000000000',
//         4: '866045000000000',
//         31: '1860415032386400026624',
//       },
//       {}
//     );
//     console.log(init);
//   });

//   it('test get_decimal_data', async () => {
//     const response = await client.getDecimalData(4, 4);
//     expect(response).toStrictEqual({ 4: (1e18).toString() });
//   });

//   it('test encode update prices', async () => {
//     const response = await client.encodeUpdateData(
//       { 4: '248731676179232030000' },
//       '64'
//     );
//     expect(response).not.toBeUndefined();
//     expect(response).toHaveProperty('length');
//     expect(response.length).toBeGreaterThan(1);
//   });

//   it('test get price data', async () => {
//     const result = await client.getCurrencyData(4, 4);
//     console.log(result);
//     expect(result).toHaveProperty('from_chain_price');
//     expect(result).toHaveProperty('to_chain_price');
//     expect(result).toHaveProperty('from_chain_decimal');
//     expect(result).toHaveProperty('to_chain_decimal');
//   });

//   it('estimate gas', async () => {
//     const result = await client.estimateFees(2, 4);
//     console.log(result);
//   });

//   it('test encode group key', async () => {
//     const response = await client.encodeUpdateGroupKey(
//       new Array(32).fill(1),
//       '643840'
//     );
//     expect(response).not.toBeUndefined();
//     expect(response).toHaveProperty('length');
//     expect(response.length).toBeGreaterThan(1);
//   });

//   it('test encode add decimal data', async () => {
//     const response = await client.encodeUpdateData(
//       { 5: 1e18.toString() },
//       "4394890"
//     );
//     expect(response).not.toBeUndefined();
//     expect(response).toHaveProperty('length');
//     expect(response.length).toBeGreaterThan(1);
//   });

//   it('test group key', async () => {
//     const gk = await client.getGroupKey();
//     expect(Buffer.from(gk).equals(groupKey)).toBeTruthy();
//   });

//   it('test all price data', async () => {
//     const gk = await client.getAllPriceData();
//     expect(gk).toHaveProperty('4');
//   });

//   it('test all decimal data', async () => {
//     const gk = await client.getAllDecimalData();
//     expect(gk).toHaveProperty('4');
//   });

//   it('test validate update prices', async () => {
//     const sigData = await client.encodeUpdateData(
//       {
//         6: '248731676179232030000',
//         5: '316761792320300001387',
//       },
//       '96'
//     );

//     const hashed = createHash('sha512')
//       .update(Buffer.concat([Buffer.from('UpdateData'), Buffer.from(sigData)]))
//       .digest();

//     const signature = await ed.sign(hashed, privateKey);

//     const success = await client.validateUpdatePrices(
//       {
//         actionId: '96',
//         newData: {
//           6: '248731676179232030000',
//           5: '316761792320300001387',
//         },
//       },
//       [...signature]
//     );
//     console.log(success);
//   });

//   it('test get prices', async () => {
//     const success = await client.getPriceData(4, 4);
//     console.log(success);
//   });

//   it('test add decimal data', async () => {
//     const sigData = await client.encodeUpdateData(
//       {
//         5: (1e18).toString(),
//       },
//       '64384034234'
//     );

//     const hashed = createHash('sha512')
//       .update(
//         Buffer.concat([Buffer.from('AddDecimalData'), Buffer.from(sigData)])
//       )
//       .digest();
//     const success = await client.validateUpdateDecimals(
//       {
//         actionId: '64384034234',
//         newData: {
//           5: (1e18).toString(),
//         }
//       },
//       [...(await ed.sign(hashed, privateKey))]
//     );
//     console.log(success);
//   });

//   it('test set group key', async () => {
//     const newPk = ed.utils.randomPrivateKey();
//     const newGk = await ed.getPublicKey(newPk);

//     const data = await client.encodeUpdateGroupKey([...newGk], '643840');

//     const hashed = createHash('sha512')
//       .update(Buffer.concat([Buffer.from('SetGroupKey'), Buffer.from(data)]))
//       .digest();

//     await client.validateUpdateGroupKey(
//       {
//         actionId: '643840',
//         groupKey: [...newGk],
//       },
//       [...(await ed.sign(hashed, privateKey))]
//     );

//     const gk = await client.getGroupKey();
//     expect(Buffer.from(gk).equals(newGk)).toBeTruthy();
//   });
// });
