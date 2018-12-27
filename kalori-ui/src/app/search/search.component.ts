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
  processedHits: SeachHit[]

  ngOnInit() {
    this
      .searchText
      .valueChanges
      .subscribe(searchText => {
        if(searchText && searchText.length > 1) {
          this.searchResults = this.lsvDbService.search(searchText, 200)
          this.processedHits = []
          for(let e of this.searchResults.entries) {
            this.processedHits.push({
              highlightedName:e.name.replace(new RegExp(this.searchResults.searchExpression, 'gi'), match => {
                return '<b>' + match + '</b>';
              }),
              kcal: e.kcal
            })
          }
        } else {
          this.searchResults = null
          this.processedHits = null
        }
      });
  }

  clearSearchInput() {
    this.searchText.setValue('');
  }
}

class SeachHit {
  highlightedName: string
  kcal: string
}
