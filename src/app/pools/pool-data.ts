import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Pool } from './pool';

export class PoolData implements InMemoryDbService {
 createDb() {
    const pools: Pool[] = [
      {
        id: 1,
        poolName: 'BayArea Brawlers',
        poolDeadlineDate: 'January 25, 2018',
        poolDeadlineTime: '10:59am',
        poolImageUrlBackground: 'assets/images/male.png', 
        poolImageUrlMain: 'assets/images/male.png',
        poolType: 'Pick Team (16 Seeds)',
        poolPaymentBreakdown: '1-3',
        poolEntryAmount: '$20',
        poolTotalEntriesAllowed: '30', 
        poolOrganizer: 'Scott Chapman',
        poolOrganizerPhone: '4055551234',
        poolDeadlineEpoch: '',
        eventLinkId: 1
      },
      {
        id: 2,
        poolName: 'BayArea Brawlers',
        poolDeadlineDate: 'January 25, 2018',
        poolDeadlineTime: '10:59am',
        poolImageUrlBackground: 'assets/images/male.png', 
        poolImageUrlMain: 'assets/images/male.png',
        poolType: 'Pick Team (16 Seeds)',
        poolPaymentBreakdown: '1-3',
        poolEntryAmount: '30',
        poolTotalEntriesAllowed: '30', 
        poolOrganizer: 'Scott Chapman',
        poolOrganizerPhone: '4055551234',
        poolDeadlineEpoch: '',
        eventLinkId: 1
      },
      {
        id: 3,
        poolName: 'BayArea Brawlers',
        poolDeadlineDate: 'January 25, 2018',
        poolDeadlineTime: '10:59am',
        poolImageUrlBackground: 'assets/images/male.png', 
        poolImageUrlMain: 'assets/images/male.png',
        poolType: 'Pick Team (16 Seeds)',
        poolPaymentBreakdown: '1-3',
        poolEntryAmount: '30',
        poolTotalEntriesAllowed: '30', 
        poolOrganizer: 'Scott Chapman',
        poolOrganizerPhone: '4055551234',
        poolDeadlineEpoch: '',
        eventLinkId: 1
      },
      {
        id: 4,
        poolName: 'BayArea Brawlers',
        poolDeadlineDate: 'January 25, 2018',
        poolDeadlineTime: '10:59am',
        poolImageUrlBackground: 'assets/images/male.png', 
        poolImageUrlMain: 'assets/images/male.png',
        poolType: 'Pick Team (16 Seeds)',
        poolPaymentBreakdown: '1-3',
        poolEntryAmount: '30',
        poolTotalEntriesAllowed: '30', 
        poolOrganizer: 'Scott Chapman',
        poolOrganizerPhone: '4055551234',
        poolDeadlineEpoch: '',
        eventLinkId: 1
      }
    ];
    return { pools };
  }
}
