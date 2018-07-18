import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'

let DropdownButton = require('react-bootstrap').DropdownButton,
    MenuItem = require('react-bootstrap').MenuItem,
    crud = require("../crud");

export class Cards extends React.Component {
    constructor(props) {
        super(props)
        // initialData will be used for live filtering.
        // That's gonna be a LOT of data. Need to figure that out.
        this.state = {initialData: null, data: null, search: null, filter: "Name"}
    
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
        let filter = this.state.filter.toLowerCase();
        let list = await crud.getCardsByFilter(this.state.search, filter);
        this.setState({data: list});
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
                return <img alt="Card face" src={cell}></img>
            }
        }];

        let results;

        if (this.state.data) {
            results = (
                <div className="results">
                    <h2>Cards</h2>
                    <BootstrapTable keyField="id" data={this.state.data} columns={columns} bordered={false}></BootstrapTable>
                </div>
            )
        }

        return (
            <div className="filter-list">
                <form onSubmit={this.getAndFilter}>
                    <div className="input-group">
                        <div className="input-group-btn">
                        <DropdownButton
                            bsStyle="default"
                            title={this.state.filter}
                            id={`dropdown-basic`}
                        >
                            <MenuItem eventKey="Name" onSelect={this.dropdownSelected}>Name</MenuItem>
                            <MenuItem eventKey="Set" onSelect={this.dropdownSelected}>Set</MenuItem>
                            <MenuItem eventKey="CMC" onSelect={this.dropdownSelected}>CMC</MenuItem>
                        </DropdownButton>
                        </div>
                        <input type="text" className="form-control form-control-lg" placeholder="Filter" onChange={this.updateSearchTerm}/>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">Go!</button>
                        </span>
                    </div>
                </form>
                {results}
            </div>
        )
    }
}