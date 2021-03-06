import { TrackData } from '../data/data';

/* Defines the a wrestling team entity */
export interface Entry {
    id: number;
    entryUsername: string;
    entryName: string;
    entryPick1: string,
    entryPick2: string,
    entryPick3: string,
    entryPick4: string,
    entryPick5: string,
    entryPick6: string,
    entryPick7: string,
    entryPick8: string,
    entryPick9: string,
    entryPick10: string,
    entryPick11: string,
    entryPick12: string,
    entryPick13: string,
    entryPick14: string,
    entryPick15: string,
    entryPick16: string,
    entryPoints?: number,
   }
   
   export interface EntryExt {
    id: number;
    poolsId: number;
    entryUsername: string;
    entryName: string;
    entryPicks: TrackData [];
    entryPoints?: number;
   }
   
   export interface EntryFire {
    id: number;
    entryUsername: string;
    entryName: string;
    entryPicks: number [];
   }

   export interface Seeds {
       name: string;
       seed: string;
       weight: string;
   }