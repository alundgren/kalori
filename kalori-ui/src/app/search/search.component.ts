import { Component, OnInit } from '@angular/core';

import * as naringsvardenJson from '../../assets/naringsvarden.json';

//Entries are: ["Name", "Kcal","Protein","Fett","Kolhydrater"]
let naringsvarden : string[][] = (naringsvardenJson as any).default;

let search = (nameFragment : string, maxCount: number) => {
  let n = nameFragment.toLocaleLowerCase();
  let hits = []
  console.log(naringsvarden)
  for(let v of naringsvarden) {
    let name = v[0];    
    if(name.toLocaleLowerCase().includes(n)) {
      hits.push({
        name: name,
        kcal: v[1]
      })
      if(hits.length === maxCount) {
        return hits
      }
    }
  }
  return hits
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
