import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Pool } from './pool';
import { PoolService } from './pool.service';

import { GenericValidator } from '../shared/generic-validator';



@Component({
  templateUrl: './pool-edit.component.html',
  styleUrls: ['../../../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css']
})
export class PoolEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Edit a pool';
  errorMessage: string;
  poolForm: FormGroup;

  pool: Pool;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  //************************ */
  //get poolTags(): FormArray {
  //  return this.poolForm.get('poolTags') as FormArray;
  //}

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private poolService: PoolService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      poolName: {
        required: 'Pool poolName is required.',
        minlength: 'Pool poolName must be at least three characters.',
        maxlength: 'Pool poolName cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.poolForm = this.fb.group({
      poolName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      poolDeadlineDate: '',
      poolDeadlineTime: '', 
      poolImageUrlBackground: '',
      poolImageUrlMain: '',
      poolType: '',
      poolPaymentBreakdown: '',
      poolEntryAmount: '',
      poolTotalEntriesAllowed: '',
      poolOrganizer: '',
      poolOrganizerPhone: '',
      poolDeadlineEpoch: '',
      eventLinkId: ''
    });

    // Read the poolId from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getPool(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur pool from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur pool observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.poolForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.poolForm);
      console.log(this.displayMessage);
    });
  }

  getPool(id: number): void {
    this.poolService.getPool(id).subscribe({
        next: (pool: Pool) => this.displayPool(pool),
        error: err => this.errorMessage = err
      });
  }

  displayPool(pool: Pool): void {
    if (this.poolForm) {
      this.poolForm.reset();
    }
    this.pool = pool;

    if (this.pool.id === 0) {
      this.pageTitle = 'Create a Pool';
    } else {
      this.pageTitle = `Edit a Pool: ${this.pool.poolName}`;
    }

    // Update the data on the form
    this.poolForm.patchValue({
      poolName: this.pool.poolName,
      poolDeadlineDate: this.pool.poolDeadlineDate,
      poolDeadlineTime: this.pool.poolDeadlineTime,
      poolImageUrlBackground: this.pool.poolImageUrlBackground,
      poolImageUrlMain: this.pool.poolImageUrlMain,
      poolType: this.pool.poolType,
      poolPaymentBreakdown: this.pool.poolPaymentBreakdown,
      poolOrganizer: this.pool.poolOrganizer,
      poolEntryAmount: this.pool.poolEntryAmount,
      poolTotalEntriesAllowed: this.pool.poolTotalEntriesAllowed,
      poolOrganizerPhone: this.pool.poolOrganizerPhone,
      poolDeadlineEpoch: this.pool.poolDeadlineEpoch,
      eventLinkId: this.pool.eventLinkId
    });
  }

  deletePool(): void {
    if (this.pool.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the pool: ${this.pool.poolName}?`)) {
        this.poolService.deletePool(this.pool.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  savePool(): void {
    if (this.poolForm.valid) {
      if (this.poolForm.dirty) {
        const p = { ...this.pool, ...this.poolForm.value };

        if (p.id === 0) {
          this.poolService.createPool(p)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.poolService.updatePool(p)
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
    this.poolForm.reset();
    this.router.navigate(['/pools']);
  }
}
