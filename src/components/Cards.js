import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Filter } from './Filter'

let crud = require("../crud");

export class Cards extends React.Component {
    constructor(props) {
        super(props)
        // initialData will be used for live filtering.
        // That's gonna be a LOT of data. Need to figure that out.
        this.state = {initialData: null, data: null, search: null, filter: "Name", loading: false}
    
        this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.dropdownSelected = this.dropdownSelected.bind(this);
        this.getAndFilter = this.getAndFilter.bind(this);
    }
    
    // Grabbing the text box.
    updateSearchTerm(event) {
        this.setState({search: event.target.value})
    }
    
    // Form input
    // TODO: Live searching, like the sets page.
    // That will need caching. Decided to use NeDB for now.
    async getAndFilter(event){
        event.preventDefault();
        this.setState({loading: true})
        let filter = this.state.filter.toLowerCase();
        let list = await crud.getCardsByFilter(this.state.search, filter);
        this.setState({data: list, loading: false});
    }
    
    // Handling the dropdown's filter state
    dropdownSelected(eventKey, event) {
        this.setState({filter: eventKey})
        event.preventDefault();
    }
    
    render() {
        const columns = [{
            dataField: 'set',
            text: 'Set'
        },{
            dataField: 'number',
            text: '#'
        }, {
            dataField: 'name',
            text: 'Name'
        }, {
            dataField: 'reverse',
            text: 'Reverse'
        }, {
            dataField: 'printings',
            text: 'Printings'
        },{
            dataField: 'type',
            text: 'Type'
        },{
            dataField: 'color',
            text: 'Color'
        },{
            dataField: 'rarity',
            text: 'Rarity'
        },{
            dataField: 'image',
            text: 'Image',
            formatter(cell) {
                return <img alt="No Card Image Available" aria-hidden src={cell}></img>
            }
        }];

        let results;

        if (this.state.data && !this.state.loading) {
            results = (
                <div className="results">
                    <h2>Cards</h2>
                    <BootstrapTable keyField="id" data={this.state.data} columns={columns} bordered={false}></BootstrapTable>
                </div>
            )
        } else if (this.state.loading) {
            results = (
                <div className="row">
                    <div className="loading-img col-sm-6 col-sm-offset-3">
                        <img className="img-responsive center-block" alt="Loading" src="loading.gif"></img>
                    </div>
                </div>
            )
        }

        return (
            <div className="filter-list col-sm-10 col-sm-offset-1">
                <Filter 
                    defaultFilter={this.state.filter}
                    button filters={["Name", "Set", "CMC"]} 
                    onSubmit={this.getAndFilter} 
                    onChange={this.updateSearchTerm} 
                    onSelect={this.dropdownSelected} 
                />
                {results}
            </div>
        )
    }
}