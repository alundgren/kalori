import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LsvDbService, SearchEntry } from '../lsv-db.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [LsvDbService]
})
export class SearchComponent implements OnInit {

  constructor(private lsvDbService: LsvDbService) { }   

  searchInput: FormControl = new FormControl()
  searchResults: SearchEntry[]

  ngOnInit() {
    this.searchInput
      .valueChanges
      .subscribe(searchText => {
        if(searchText && searchText.length > 1) {
          this.searchResults = this.lsvDbService.search(searchText, 100)
        } else {
          this.searchResults = []
        }
      });
  }
}
