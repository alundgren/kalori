import { Injectable } from '@angular/core';

import * as naringsvardenJson from '../assets/naringsvarden.json';

//Entries are: ["Name", "Kcal","Protein","Fett","Kolhydrater"]
let naringsvarden : string[][] = (naringsvardenJson as any).default;

@Injectable({
  providedIn: 'root'
})
export class LsvDbService {  
  constructor() { 

  }

  search(nameFragment : string, maxCount: number) : SearchEntry[] {
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
    
    hits.sort((x, y) => x.name && y.name ? x.name.length - y.name.length : 1)
    if(hits.length > maxCount) {
      return hits.slice(0, maxCount)
    } else {
      return hits
    }
  }
}

class Item {
  name: string
  kcal: string
  tokens: string[]  
}

export class SearchEntry {
  name: string
  kcal: string
}
