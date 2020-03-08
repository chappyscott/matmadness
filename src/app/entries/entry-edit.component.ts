import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import seeds from '../../assets/json/wrestlers-seeds.json';

import { Entry } from './entry';
import { EntryService } from './entry.service';

import { GenericValidator } from '../shared/generic-validator';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';


export interface IndexStore {
  id?: string;
  index: number;
  name: string;
  poolsId: number;
};


@Component({
  templateUrl: './entry-edit.component.html',
  styleUrls: ['./entry-edit.component.css']
})

export class EntryEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Edit a entry';
  errorMessage: string;
  entryForm: FormGroup;
  indexRef: AngularFirestoreCollection<IndexStore>;
  index$: Observable<IndexStore[]>;
  items: Observable<any[]>;
  
  // cheat for now and just bruteforce running out of time.
  numberOfPicks: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  weightClasses: string [] = ['125', '133', '141', '149','157', '165', '174', '184', '197', '285'];
  verification_array: string [] = ['125', '133', '141', '149','157', '165', '174', '184', '197', '285'];
  verification_picks: string [] = ['','','','','','','','','','','','','','','',''];
  verification_picks_names: string [] = ['','','','','','','','','','','','','','','',''];
  entry: Entry;
  private sub: Subscription;
  poolsId: number;
  autoindex: number;
  autoid: string;
  wSeeds = seeds;


  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  //************************ */
  //get entryTags(): FormArray {
  //  return this.entryForm.get('entryTags') as FormArray;
  //}

  
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private entryService: EntryService,
              firestore: AngularFirestore,
              private afs: AngularFirestore
              ) {
    
    this.items = firestore.collection('picks').valueChanges();
    console.log("Items:", this.items);
    
    this.indexRef = this.afs.collection<IndexStore>('numOfEntries');
    this.index$ = this.indexRef.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as IndexStore;
        const id = action.payload.doc.id;
        return { id, ...data };
      });
    }));
    
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      entryName: {
        required: 'Your Bracket Name is required.',
        minlength: 'Your Bracket Name must be at least three characters.',
        maxlength: 'Your Bracket Name cannot exceed 50 characters.'
      },
      entryUsername: {
        required: 'Your Name is required.',
        minlength: 'Your Bracket Name must be at least three characters.',
        maxlength: 'Your Bracket Name cannot exceed 50 characters.'
      },
      entryPick1: {
        required: '#1 Seed is required.',
      },
      entryPick2: {
        required: '#2 Seed is required.',
      },
      entryPick3: {
        required: '#3 Seed is required.',
      },
      entryPick4: {
        required: '#4 Seed is required.',
      },
      entryPick5: {
        required: '#5 Seed is required.',
      },
      entryPick6: {
        required: '#6 Seed is required.',
      },
      entryPick7: {
        required: '#7 Seed is required.',
      },
      entryPick8: {
        required: '#8 Seed is required.',
      },
      entryPick9: {
        required: '#9 Seed is required.',
      },
      entryPick10: {
        required: '#10 Seed is required.',
      },
      entryPick11: {
        required: '#11 Seed is required.',
      },
      entryPick12: {
        required: '#12 Seed is required.',
      },
      entryPick13: {
        required: '#13 Seed is required.',
      },
      entryPick14: {
        required: '#14 Seed is required.',
      },
      entryPick15: {
        required: '#15 Seed is required.',
      },
      entryPick16: {
        required: '#16 Seed is required.',
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    
    this.entryForm = this.fb.group({
      entryName: ['', [Validators.required,
                       Validators.minLength(3),
                       Validators.maxLength(50)]],
      entryUsername: ['', [Validators.required,
                           Validators.minLength(3),
                           Validators.maxLength(50)]],
      entryPick1: ['', Validators.required],
      entryPick2: ['', Validators.required],
      entryPick3: ['', Validators.required],
      entryPick4: ['', Validators.required],
      entryPick5: ['', Validators.required],
      entryPick6: ['', Validators.required],
      entryPick7: ['', Validators.required],
      entryPick8: ['', Validators.required],
      entryPick9: ['', Validators.required],
      entryPick10: ['', Validators.required],
      entryPick11: ['', Validators.required],
      entryPick12: ['', Validators.required],
      entryPick13: ['', Validators.required],
      entryPick14: ['', Validators.required],
      entryPick15: ['', Validators.required],
      entryPick16: ['', Validators.required],
    });

    // Read the entryId from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        this.poolsId = +params.get('poolsId');
        const id = +params.get('id');
        console.log("1st poolsId:", this.poolsId, id);
        // I don't allow editing of entry for now.  Just pass 0.
        this.getEntry(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur entry from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur entry observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.entryForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.entryForm);
    });
  }

  getEntry(id: number): void {
    this.entryService.getEntry(id).subscribe({
        next: (entry: Entry) => this.displayEntry(entry),
        error: err => this.errorMessage = err
      });
  }

  displayEntry(entry: Entry): void {
    if (this.entryForm) {
      this.entryForm.reset();
    }
    this.entry = entry;

    if (this.entry.id === 0) {
      this.pageTitle = 'Create a entry';
    } else {
      this.pageTitle = `Edit a tournament: ${this.entry.entryName}`;
    }


   
    // Update the data on the form
    this.entryForm.patchValue({
      entryName: this.entry.entryName,
      entryUsername: this.entry.entryUsername,
      entryPick1: this.entry.entryPick1,
      entryPick2: this.entry.entryPick2,
      entryPick3: this.entry.entryPick3,
      entryPick4: this.entry.entryPick4,
      entryPick5: this.entry.entryPick5,
      entryPick6: this.entry.entryPick6,
      entryPick7: this.entry.entryPick7,
      entryPick8: this.entry.entryPick8,
      entryPick9: this.entry.entryPick9,
      entryPick10: this.entry.entryPick10,
      entryPick11: this.entry.entryPick11,
      entryPick12: this.entry.entryPick12,
      entryPick13: this.entry.entryPick13,
      entryPick14: this.entry.entryPick14,
      entryPick15: this.entry.entryPick15,
      entryPick16: this.entry.entryPick16,  
    });
  }

  deleteEntry(): void {
    if (this.entry.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the entry: ${this.entry.entryName}?`)) {
        this.entryService.deleteEntry(this.entry.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }


saveFireEntry(): void {
  console.log("POOLSID:", this.poolsId);
  if (this.entryForm.valid) {
    if (this.entryForm.dirty) {


      let indexSubscription = this.index$.subscribe({
        next: index => {
          console.log('ID ALL: ', index);
          for(let i=0; i < index.length; i++){
            console.log("IDX:", index[i].poolsId, this.poolsId)
            if (index[i].poolsId == this.poolsId){
              console.log("MDE HR")
              // this.autoid = index[i];
              // this.autoindex = index[i];
            }
          }
        },
        error(msg) {
          console.log('Error Getting Location: ', msg);
        }
      //   ,
      //   onComplete(){indexSubscription.unsubscribe();}
      });

      const p = { ...this.entry, ...this.entryForm.value };
      this.entryService.createFireEntry(p, this.poolsId, 1);
      this.entryService.updateFireIndex("y1S2XNMMwqh8vOOMrkgW");  // Get doc id from firestore
      this.onSaveComplete();
      



      } else {
      this.onSaveComplete();
    }
  } else {
    this.errorMessage = 'Please correct the validation errors.';
  }
}

verifyAllWeightsSelected(value:string, position:number){
  console.log("the selected value is " + value, position);
  let old_val = this.verification_picks[position-1];
  this.verification_picks[position-1] = value;
  switch(value){
    case "125":
      this.verification_picks_names[position-1] = this.wSeeds[0][position-1].name;
    break;
    case "133":
      this.verification_picks_names[position-1] = this.wSeeds[1][position-1].name;
    break;
    case "141":
      this.verification_picks_names[position-1] = this.wSeeds[2][position-1].name;
    break;
    case "149":
      this.verification_picks_names[position-1] = this.wSeeds[3][position-1].name;
    break;
    case "157":
      this.verification_picks_names[position-1] = this.wSeeds[4][position-1].name;
    break;
    case "165":
      this.verification_picks_names[position-1] = this.wSeeds[5][position-1].name;
    break;
    case "174":
      this.verification_picks_names[position-1] = this.wSeeds[6][position-1].name;
    break;
    case "184":
      this.verification_picks_names[position-1] = this.wSeeds[7][position-1].name;
    break;
    case "197":
      this.verification_picks_names[position-1] = this.wSeeds[8][position-1].name;
    break;
    case "285":
      this.verification_picks_names[position-1] = this.wSeeds[9][position-1].name;
   break;
  }
  //console.log("Old Value: ", old_val);
  //console.log("VP: ", this.verification_picks);

   //console.log("IVA: ", this.verification_array.indexOf(value));
  if (this.verification_array.indexOf(value)>=0){
    //console.log("Inside splice");
    //console.log("Index VA: ", this.verification_array.indexOf(value));
    this.verification_array.splice(this.verification_array.indexOf(value),1);
    //console.log("VWC: ", this.verification_array);
  }

  if (old_val !== ''){
    if (!this.verification_picks.includes(old_val)){
      this.verification_array.push(old_val);
    }
  }
}


updateFireIndexTest(){
  this.entryService.updateFireIndex("y1S2XNMMwqh8vOOMrkgW");
  //console.log("I am here inc up");
}


  saveEntry(): void {
    if (this.entryForm.valid) {
      if (this.entryForm.dirty) {
        const p = { ...this.entry, ...this.entryForm.value };

        if (p.id === 0) {
          this.entryService.createEntry(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.entryService.updateEntry(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.entryForm.reset();
    this.router.navigate(['/entries', this.poolsId]);
  }
}
