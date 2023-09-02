import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createLogger } from '../logging.utils';
import { Erc721SalesService } from '../erc721sales.service';
import { TransactionReceipt } from 'ethers';

const logger = createLogger('phunksauction.service')

@Injectable()
export class CryptoPunksService extends Erc721SalesService {


  constructor(
    protected readonly http: HttpService,
  ) {
    super(http)
    logger.info('creating CryptoPunksService')
    
  }

  getTokenId(tx:any, receipt:TransactionReceipt) {
    return parseInt(receipt.logs.filter(l => l.topics[0] === '0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3')[0].topics[1]).toString()
  }
}
