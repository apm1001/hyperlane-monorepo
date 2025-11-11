import { rootLogger } from '@hyperlane-xyz/utils';

import { ISigner } from '../altvm.js';
import { AnnotatedTx, TxReceipt } from '../module.js';
import {
  ITransactionSubmitter,
  TransactionSubmitterType,
} from '../submitter.js';

export class AltVMJsonRpcSubmitter implements ITransactionSubmitter {
  protected logger;

  type = TransactionSubmitterType.JSON_RPC;

  constructor(
    public readonly signer: ISigner<AnnotatedTx, TxReceipt>,
    public readonly config: { chain: string },
  ) {
    this.logger = rootLogger.child({
      module: AltVMJsonRpcSubmitter.name,
    });
  }

  async submit(...transactions: AnnotatedTx[]): Promise<TxReceipt[]> {
    if (transactions.length === 0) {
      return [];
    }

    if (this.signer.supportsTransactionBatching()) {
      for (const transaction of transactions) {
        if (transaction.annotation) {
          this.logger.debug(transaction.annotation);
        }
      }
      const receipt =
        await this.signer.sendAndConfirmBatchTransactions(transactions);
      return [receipt];
    }

    const receipts: TxReceipt[] = [];

    for (const tx of transactions) {
      if (tx.annotation) {
        this.logger.debug(tx.annotation);
      }

      const receipt = await this.signer.sendAndConfirmTransaction(tx);
      receipts.push(receipt);
    }

    return receipts;
  }
}
