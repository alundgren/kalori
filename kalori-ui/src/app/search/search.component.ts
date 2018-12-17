import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LsvDbService, SearchEntry } from '../lsv-db.service';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [LsvDbService]
})
export class SearchComponent implements OnInit {

  constructor(private lsvDbService: LsvDbService) {  }   
  
  form = new FormGroup({
    searchText: new FormControl('', Validators.minLength(2))
  })

  get searchText(): FormControl { return this.form.get('searchText') as FormControl; }

  searchResults: SearchEntry[]

  ngOnInit() {
    this
      .searchText
      .valueChanges
      .subscribe(searchText => {
        if(searchText && searchText.length > 1) {
          this.searchResults = this.lsvDbService.search(searchText, 100)
        } else {
          this.searchResults = []
        }
      });
  }

  clearSearchInput() {
    this.searchText.setValue('');
  }
}
