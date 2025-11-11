import { AnnotatedTx, TxReceipt } from './module.js';

// By default each VM implementation should at least define a JSON rpc submitter
export const TransactionSubmitterType = {
  JSON_RPC: 'jsonRpc',
  IMPERSONATED_ACCOUNT: 'impersonatedAccount',
  GNOSIS_SAFE: 'gnosisSafe',
  GNOSIS_TX_BUILDER: 'gnosisSafeTxBuilder',
  INTERCHAIN_ACCOUNT: 'interchainAccount',
  TIMELOCK_CONTROLLER: 'timelockController',
} as const;

export type TransactionSubmitterType =
  (typeof TransactionSubmitterType)[keyof typeof TransactionSubmitterType];

export interface JsonRpcSubmitterConfig {
  type: typeof TransactionSubmitterType.JSON_RPC;
  privateKey: string;
  accountAddress?: string;
}

export type TransactionSubmitterConfig<T extends { type: string }> =
  | JsonRpcSubmitterConfig
  | T;

export interface ITransactionSubmitter<
  TSubmitterType extends string = TransactionSubmitterType,
> {
  type: TSubmitterType;

  submit(...transactions: AnnotatedTx[]): Promise<TxReceipt[]>;
}
