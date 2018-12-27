import { Injectable } from '@angular/core';

import * as naringsvardenJson from '../assets/naringsvarden.json';
import * as dice from 'dice-coefficient';

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
        name: name.trim(),
        normalizedName: name.trim().toLocaleLowerCase(),
        kcal: v[1]
      }
      this.items.push(i)
    }    
  }

  private createMatchExpression(nameFragment : string) : string {
    let escape = (s :string) => {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    }

    let e = ''
    for(let word of nameFragment.split(' ')) {
      if(e.length > 0) {
        e = e + '|'
      }
      e = e + `(\S*${escape(word)}\S*)`
    }
    return e
  }

  search(nameFragment : string, maxCount: number) : SearchResult {    
    let hits : ISearchEntry[] = []
    let re = this.createMatchExpression(nameFragment.toLocaleLowerCase())    
    for(let item of this.items) {
      let m = new RegExp(re, 'gi').exec(item.name.toLocaleLowerCase())
      if(m != null) {
        hits.push(item)
      }
    }

    hits = this.filterAllWordsMustBeIncluded(nameFragment, hits)
    
    hits.sort((x, y) => this.sortValue(nameFragment, y) - this.sortValue(nameFragment, x))
    return {
      entries: hits.length > maxCount ? hits.slice(0, maxCount): hits,
      searchExpression: re,
      totalEntries: hits.length
    }
  }

  filterAllWordsMustBeIncluded(nameFragment: string, hits: ISearchEntry[]) : ISearchEntry[] {
    let words = nameFragment.toLocaleLowerCase().split(' ')
    let isIncluded = (s: string) => {
      let sn = s.toLocaleLowerCase()
      for(let word of words) {
        if(!sn.includes(word)) {
          return false
        }
      }
      return true
    }

    let result : ISearchEntry[] = []
    for(let h of hits) {
      if(isIncluded(h.name)) {
        result.push(h)
      }
    }

    return result
  }

  private sortValue(searchText: string, i: ISearchEntry) : number {
    return dice(searchText, i.name)
  }  
}

class Item implements ISearchEntry {
  name: string
  normalizedName: string  
  kcal: string
}

export class SearchResult {
  entries: ISearchEntry[]
  searchExpression: string
  totalEntries: number
}
export interface ISearchEntry {
  name: string
  kcal: string
}
