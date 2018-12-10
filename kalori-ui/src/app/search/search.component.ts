import { Component, OnInit } from '@angular/core';
import { LsvDbService } from '../lsv-db.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [LsvDbService],
  styles: [`.form-control { width: 600px; }`]
})
export class SearchComponent implements OnInit {

  constructor(private lsvDbService: LsvDbService) { }

  public model : any

  ngOnInit() {
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.lsvDbService.search(term, 7))
    )

  formatter = (x: {name: string}) => x.name

}
