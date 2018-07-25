import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Filter } from './Filter'

const ipcRenderer = window.require("electron").ipcRenderer;

export default class Cards extends React.Component {
    constructor(props) {
        super(props)
        this.searchState = new React.createRef();
        this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.dropdownSelected = this.dropdownSelected.bind(this);
        this.getAndFilter = this.getAndFilter.bind(this);
    }
    
    // Grabbing the text box.
    updateSearchTerm(event) {
        this.props.dispatch({type: "updateSearch", search: event.target.value})
    }
    
    // Form input
    // TODO: Live searching, like the sets page.
    // That will need caching. Decided to use NeDB for now.
    async getAndFilter(event){
        if (event) event.preventDefault();
        this.props.dispatch({type: "setLoading", loading: true})
        let filter = this.props.filter.toLowerCase();
        ipcRenderer.send("get-cards", {search: this.props.search, filter: filter})
        ipcRenderer.once("cards-returned", (event, list) => {
            console.log("Returned")
            this.props.dispatch({type: "handleSearch", sets: list, loading: false});
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.filter);
        if (nextProps.updateView) {
            this.getAndFilter();
            this.props.dispatch({type: "updateView", updateView: false})
        }
    }
    
    // Handling the dropdown's filter state
    dropdownSelected(eventKey, event) {
        event.preventDefault();
        this.props.dispatch({type: "setCardsFilter", filter: eventKey, updateView: true});
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
            dataField: "cmc",
            text: "CMC"
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

        if (this.props.data && !this.props.loading) {
            results = (
                <div className="results">
                    <h2>Cards</h2>
                    <BootstrapTable keyField="id" data={this.props.data} columns={columns} bordered={false}></BootstrapTable>
                </div>
            )
        } else if (this.props.loading) {
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
                    defaultFilter={this.props.filter}
                    button filters={["Name", "Set", "CMC"]}
                    defaultText={this.props.search}
                    thisRef={this.searchState}
                    onSubmit={this.getAndFilter} 
                    onChange={this.updateSearchTerm} 
                    onSelect={this.dropdownSelected} 
                />
                {results}
            </div>
        )
    }
}