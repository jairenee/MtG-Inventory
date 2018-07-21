import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Filter, SetList } from './Filter'

let crud = require("../crud");

export class Sets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {initialData: null, data: null, filter: "Name"};
    
        this.filterList = this.filterList.bind(this);
        this.filterListSets = this.filterListSets.bind(this);
        this.dropdownSelected = this.dropdownSelected.bind(this);
    }
  
    // This is for when I need to organize loose cards
    // by set. I like to put them in release date order,
    // so getting the specific sets I have in front of me
    // is really useful.
    // Got this finally working in real time.
    filterListSets(event){
        let allData = this.state.initialData,
            setCodes = event.target.value.split(","),
            updatedList = [];
        if (setCodes[setCodes.length-1] === "") {
            setCodes.pop();
        }
        for (let code of setCodes) {
            for (let set in allData) {
            if (allData[set].code.toLowerCase() === code.toLowerCase()) updatedList.push(allData[set]);
            }
        }
        updatedList.sort((a, b) => {
            return new Date(a.release) - new Date(b.release)
        })
        this.setState({data: updatedList});
    }
  
    // Filter from the search bar instead, for less
    // group focused searching.
    filterList(event){
        let filter = this.state.filter.toLowerCase();
        var updatedList = this.state.initialData;
        updatedList = updatedList.filter(function(item){
            return (item[filter].toLowerCase().search(
                event.target.value.toLowerCase()) !== -1);
        });
        this.setState({data: updatedList});
    }

    // Handling the dropdown's filter state.
    dropdownSelected(eventKey, event) {
        this.setState({filter: eventKey})
        event.preventDefault();
    }

    // Setting up initial data so data can be
    // filtered on the fly without modifying
    // the presented data.
    // TODO: Cache
    async componentWillMount() {
        let sets = await crud.getAllSets()
        for (let set in sets) {
            let icon = `ss ss-${sets[set].code.toLowerCase()} ss-2x ss-fw`
            sets[set].icon = <i className={icon}></i>;
        }
        this.setState({initialData: sets, data: sets})
    }
  
    render() {
        const columns = [{
            dataField: 'icon',
            text: 'Symbol'
        },{
            dataField: 'name',
            text: 'Name'
        }, {
            dataField: 'code',
            text: 'Code'
        }, {
            dataField: 'type',
            text: 'Type'
        }, {
            dataField: 'release',
            text: 'Release Date'
        }];

        let results;

        if (this.state.data) {
            results = (
                <div className="results">
                    <h2>Sets</h2>
                    <BootstrapTable keyField="name" data={this.state.data} columns={columns} bordered={false}></BootstrapTable>
                </div>
            )
        } else {
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
                    filters={["Name", "Code", "Type"]}
                    onSelect={this.dropdownSelected}
                    onChange={this.filterList}
                />
                <SetList onChange={this.filterListSets} />
                {results}
            </div>
        )
    }
}