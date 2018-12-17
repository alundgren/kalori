import { Injectable } from '@angular/core';

import * as naringsvardenJson from '../assets/naringsvarden.json';
import * as dice from 'dice-coefficient';
import * as doubleMetaphone from 'double-metaphone';

//Entries are: ["Name", "Kcal","Protein","Fett","Kolhydrater"]
let naringsvarden : string[][] = (naringsvardenJson as any).default;

@Injectable({
  providedIn: 'root'
})
export class LsvDbService {  
  private items: Item[]
  constructor() { 
    this.items = []
    for(let v of naringsvarden) {
      let name = v[0];
      let i = {
        name: name,
        kcal: v[1],
        tokens: this.tokenize(name)
      }
      this.items.push(i)
    }    
  }

  private tokenize(n: string) : Set<string> {
    return new Set<string>(doubleMetaphone(name))
  }

  search(nameFragment : string, maxCount: number) : SearchResult {
    let n = this.tokenize(nameFragment)
    let hits : ISearchEntry[] = []    
    for(let v of this.items) {
      if(this.isSuperset(v.tokens, n)) {
        hits.push(v)
      }        
    }
    
    hits.sort((x, y) => this.sortValue(nameFragment, y) - this.sortValue(nameFragment, x))
    return {
      entries: hits.length > maxCount ? hits.slice(0, maxCount): hits,
      totalEntries: hits.length
    }
  }

  private isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

  private sortValue(searchText: string, i: ISearchEntry) : number {
    return dice(searchText, i.name)
  }  
}

class Item implements ISearchEntry {
  name: string
  kcal: string
  tokens: Set<string>
}

export class SearchResult {
  entries: ISearchEntry[]
  totalEntries: number
}
export interface ISearchEntry {
  name: string
  kcal: string
}
