import React, { useState } from 'react';
import LsvDbService from './lsv-db.service';
import './App.css';

let lsvDbService = new LsvDbService();

function App() {
    let [searchText, setSearchText] = useState('');

    let searchResult = searchText && searchText.length > 1 
        ? lsvDbService.search(searchText, 200)
        : null;
    let processedHits = [] as  ProcessedSeachHit[];
    if(searchResult && searchResult.entries.length > 0) {
        for(let e of searchResult.entries) {
            processedHits.push({
            highlightedName:e.name.replace(new RegExp(searchResult.searchExpression, 'gi'), match => {
              return '<b>' + match + '</b>';
            }),
            kcal: e.kcal
          })
        }        
    }

    let onSearchTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    let onRemoveClicked = (e: React.SyntheticEvent) => {
        setSearchText('');
    };

    let clearElement : JSX.Element = <></>;
    if(searchText) {
        clearElement = <span className="fa fa-remove" onClick={onRemoveClicked}></span>
    }

    return (      
        <div className="container bg-faded">
            <div className="row my-2">
                <div className="col">
                <div className="mx-auto">
                    <form> 
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Varunamn, t ex apelsin" autoComplete="off" value={searchText} onChange={onSearchTextChanged} />
                            {clearElement}                            
                        </div>  
                        
                    </form>
                    {processedHits && processedHits.length > 0 ? (
                    <table className="table table-striped">
                        <tbody>
                            {processedHits.map(x => (
                            <tr key={x.highlightedName}>
                                <td dangerouslySetInnerHTML={({__html: x.highlightedName})}></td>
                                <td>{x.kcal}</td>
                            </tr>
                            ))}
                            
                            {searchResult && searchResult.totalEntries > processedHits.length ? (
                                <tr>
                                    <td colSpan={2}>... och ytterligare x träffar som inte visas</td>
                                </tr>
                            ) : null}
                        </tbody>    
                    </table>) 
                    : null}
                    </div>
                </div>
            </div>
        </div>

    );
}

interface ProcessedSeachHit {
    highlightedName: string
    kcal: string
}

export default App;
