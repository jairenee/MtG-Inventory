import React from "react"

const columns =  [{
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

export default columns;