import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { FilterList, Filter, SetList } from './Filter'
import columns from "./constants/sets"

const ipcRenderer = window.require("electron").ipcRenderer;
let setMounted = false;

export default class Sets extends React.Component {
    constructor(props) {
        super(props)

        this.filterListState = new React.createRef();
        this.setsListState = new React.createRef();
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
        event.preventDefault();
        let allData = this.props.initialData,
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
        this.props.dispatch({type: "handleSets", sets: updatedList, setsList: this.setsListState.current.value});
    }
  
    // Filter from the search bar instead, for less
    // group focused searching.
    filterList(event){
        if (event) event.preventDefault();
        let that = this;
        let filter = this.props.filter.toLowerCase();
        var updatedList = this.props.initialData;
        updatedList = updatedList.filter(function(item){
            return (item[filter].toLowerCase().search(
                event ? event.target.value.toLowerCase() : that.filterListState.current.value) !== -1);
        });
        this.props.dispatch({type: "handleFilters", sets: updatedList, filterText: this.filterListState.current.value});
    }

    // Handling the dropdown's filter state.
    dropdownSelected(eventKey, event) {
        event.preventDefault();
        this.props.dispatch({type: "setSetsFilter", filter: eventKey})
            .then(() => {
                if (this.filterListState.current.value) this.filterList();
            });
    }

    // Setting up initial data so data can be
    // filtered on the fly without modifying
    // the presented data.
    async componentDidMount() {
        if (!setMounted) {
            ipcRenderer.send("get-sets")
            ipcRenderer.on("sets-returned", (event, sets) => {
                for (let set in sets) {
                    let icon = `ss ss-${sets[set].code.toLowerCase()} ss-2x ss-fw`
                    sets[set].icon = <i className={icon}></i>;
                }
                this.props.dispatch({type: "setsMounted", sets: sets})
            })
            setMounted = true;
        }
    }
  
    render() {
        let results;

        if (this.props.data) {
            if (this.props.data.length) {
                results = (
                    <div className="results">
                        <BootstrapTable keyField="name" data={this.props.data} columns={columns} bordered={false}></BootstrapTable>
                    </div>
                )
            } else {
                results = (
                    <div className="results">
                        <center><h3>No results found.</h3></center>
                    </div>
                )
            }
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
                    currentFilter={this.props.filter}
                    filters={["Name", "Code", "Type"]}
                    currentText={this.props.filterText}
                    onSelect={this.dropdownSelected}
                    onChange={this.filterList}
                    thisRef={this.filterListState}
                />
                <SetList 
                    currentText={this.props.setsList}
                    thisRef={this.setsListState} 
                    onChange={this.filterListSets} 
                />
                <h2>Sets</h2>
                {results}
            </div>
        )
    }
}