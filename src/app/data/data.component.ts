import {Component, OnInit, ViewChild} from '@angular/core';
import seeds from '../../assets/json/wrestlers-seeds.json';
import points from '../../assets/json/wrestlers-scores.json';
import deductions from '../../assets/json/wrestlers-deductions.json';
//counts is by [seed][weight] so #1 seeds is 0 array and 125 #1 would be [0][0] 
import counts from '../../assets/json/wrestlers-counts.json';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrackData } from './data';
 
  /** Constants used to fill up our data base. */
  const COLORS: string[] = [
    'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
    'aqua', 'blue', 'navy', 'black', 'gray'
  ];
  const NAMES: string[] = [
    'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
    'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
  ];



@Component({
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit {
  public pageTitle = 'Results (DATA)';

  //READ IN THE DATABASE OF WRESTLERS AS WELL.  OR just link to it?
  wSeeds: any = seeds;
  wPoints: any = points;

  wDeductions = deductions;

  displayedColumns = ['weight', 'seed', 'name', 'adPoints', 'actPoints', 'plPoints', 'points', 'numPicks', 'percentDiscount', 'discountedPoints'];
  dataSource: MatTableDataSource<TrackData>;
  updateWrestler: TrackData;
  finalWrestlers: TrackData[] = [];
  wrestlersWeights: number [] = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285]
  findNumPicksBySeedByWeight: number[][];

  wrestlerLookupByName = this.wPoints.reduce((current_dict, new_dict) => {
    current_dict[new_dict.name.slice(0,19)] = new_dict.wrestler;
    return current_dict;
  }, {} );

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() {
    // Create 320 (32 wrestlers in 10 weight classes) from data
      
    // Assign the data to the data source for the table to render
    
};
  ngOnInit() {

  

    console.log(counts);

    for (let w =0; w<10; w++){
      for (let x = 0; x<32; x++){
        console.log("look name: ", seeds[w][x].name.slice(0,19));
        let lookup = this.wrestlerLookupByName[seeds[w][x].name.slice(0,19)];        
        console.log("lookup: ", lookup);

        this.updateWrestler = {
                weight: lookup.weight,
                seed: seeds[w][x].seed,
                name: lookup.name,
                adPoints: lookup.adPoints,
                actPoints: lookup.actPoints,
                plPoints: lookup.plPoints,
                points: lookup.points,
                // counts[16][0] stores the total number of picks from node.js ../../startTournament/index.js file.
                numPicks: x < 16 ? counts[x][w].toString() : (counts[16][0]).toString(), // Sum up total number of people who picked them
                percentDiscount: x < 16 ? counts[x][w]>0 ? (1 - (counts[x][w]-1)/counts[16][0]).toFixed(4).toString() : "1" : "0",  // calculate 1 - (numPicks-1)/total entries
                discountedPoints: x < 16 ? counts[x][w]>0 ? ((1 - (counts[x][w]-1)/counts[16][0])*Number(lookup.points)).toFixed(2).toString() : lookup.points.toString() : "0"// this.discountedPoints
          };
          this.finalWrestlers.push(this.updateWrestler);
      }
    }
    this.dataSource = new MatTableDataSource(this.finalWrestlers);
    this.dataSource.sort = this.sort;
  }
    //console.log("CD: ",current_dict);


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

/** Builds and returns a new User. */
function createWrestler(id: number): TrackData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';
  
    return {
      weight: id.toString(),
      seed: id.toString(),
      name: name,
      adPoints: Math.round(Math.random() * 100).toString(),
      actPoints: Math.round(Math.random() * 100).toString(),
      plPoints: Math.round(Math.random() * 100).toString(),
      points: Math.round(Math.random() * 100).toString(),
      numPicks: Math.round(Math.random()).toString(),
      percentDiscount: Math.round(Math.random()).toString(),
      discountedPoints: Math.round(Math.random() * .1).toString()
    };
  };