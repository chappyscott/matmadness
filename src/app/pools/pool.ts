/* Defines the a betting pool entity */
export interface Pool {
    id: number;

    //for Pool design splash page
    poolName: string;
    poolImageUrlBackground: string; 
    poolImageUrlMain: string;
    poolOrganizer: string;
    poolOrganizerPhone: string;

    //for Pool Details
    poolDeadlineDate: string;
    poolDeadlineTime: string;
    poolType: string;
    poolPaymentBreakdown: string;
    poolEntryAmount: string;
    poolTotalEntriesAllowed: string;
    poolDeadlineEpoch: string;
    eventLinkId: number;
   }
