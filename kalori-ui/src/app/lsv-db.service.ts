import { Injectable } from '@angular/core';

import * as naringsvardenJson from '../assets/naringsvarden.json';
import * as dice from 'dice-coefficient';

//Entries are: ["Name", "Kcal","Protein","Fett","Kolhydrater"]
let naringsvarden : string[][] = (naringsvardenJson as any).default;

@Injectable({
  providedIn: 'root'
})
export class LsvDbService {  
  constructor() { 
    
  }

  search(nameFragment : string, maxCount: number) : SearchResult {
    let n = nameFragment.toLocaleLowerCase()
    let hits : SearchEntry[] = []    
    for(let v of naringsvarden) {
      let name = v[0];
      if(name.toLocaleLowerCase().includes(n)) {
        hits.push({
          name: name,
          kcal: v[1]
        })
      }
    }
    
    hits.sort((x, y) => this.sortValue(nameFragment, y) - this.sortValue(nameFragment, x))
    return {
      entries: hits.length > maxCount ? hits.slice(0, maxCount): hits,
      totalEntries: hits.length
    }
  }

  private sortValue(searchText: string, i: SearchEntry) : number {
    return dice(searchText, i.name)
  }  
}

class Item {
  name: string
  kcal: string
  tokens: string[]  
}

export class SearchResult {
  entries: SearchEntry[]
  totalEntries: number
}
export class SearchEntry {
  name: string
  kcal: string
}
