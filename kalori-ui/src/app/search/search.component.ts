import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LsvDbService, ISearchEntry, SearchResult } from '../lsv-db.service';
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

  searchResults: SearchResult

  ngOnInit() {
    this
      .searchText
      .valueChanges
      .subscribe(searchText => {
        if(searchText && searchText.length > 1) {
          this.searchResults = this.lsvDbService.search(searchText, 100)
        } else {
          this.searchResults = null
        }
      });
  }

  clearSearchInput() {
    this.searchText.setValue('');
  }
}
