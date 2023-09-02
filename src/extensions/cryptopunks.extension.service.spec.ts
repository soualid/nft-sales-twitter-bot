import { Test, TestingModule } from '@nestjs/testing';
import { Erc721SalesService } from '../erc721sales.service';
import { HttpModule } from '@nestjs/axios';
import { ethers } from 'ethers';
import { config } from '../config';
import erc721abi from '../abi/erc721.json'
import { CryptoPunksService } from './cryptopunks.extension.service';

const COOLDOWN_BETWEEN_TESTS = 1500

describe('CryptoPunksService', () => {
  let service: CryptoPunksService;
  jest.setTimeout(60000) 

  afterAll(() => {
    service.provider.destroy()
  });

  beforeEach(async () => {

    //jest.useFakeTimers()

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CryptoPunksService],
    }).compile()

    service = module.get<CryptoPunksService>(CryptoPunksService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  });

  it('0xe460a7f7d4c5161f33bbbf4c4779a441885f50140faf10fcda0accb2637ce890 - punk sale', async () => {
    await delay(COOLDOWN_BETWEEN_TESTS)
    const provider = service.getWeb3Provider()
    config.contract_address = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB'
    const tokenContract = new ethers.Contract('0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', erc721abi, provider);
    let filter = tokenContract.filters.Transfer();
    const startingBlock = 18035326    
    const events = await tokenContract.queryFilter(filter, 
      startingBlock, 
      startingBlock+1)
    const results = await Promise.all(events.map(async (e) => await service.getTransactionDetails(e)))
    //expect(results[0].alternateValue).toBe(0.31)
    let logs = ''
    results.forEach(r => {
      logs += `${r.tokenId} sold for ${r.value}\n`
    })

    service.initDiscordClient()

    await delay(COOLDOWN_BETWEEN_TESTS)
    await delay(COOLDOWN_BETWEEN_TESTS)
    for (const result of results) {
      //expect(result.alternateValue).toBe(0.281)
      await service.discord(result)
    }
    console.log(logs)
    await delay(COOLDOWN_BETWEEN_TESTS)
    await delay(COOLDOWN_BETWEEN_TESTS)
  })

});

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}