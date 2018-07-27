import React from "react"
import FlippingCard from "../FlippingCard"

const columns =  [{
    dataField: 'set',
    text: 'Set',
    sort: true,
},{
    dataField: 'number',
    text: '#',
    sort: true,
},{
    dataField: 'name',
    text: 'Name',
    sort: true,
},{
    dataField: "cmc",
    text: "CMC",
    sort: true,
// },{
//     dataField: 'reverse',
//     text: 'Reverse'
// },{
//     dataField: 'printings',
//     text: 'Printings'
},{
    dataField: 'type',
    text: 'Type'
},{
    dataField: 'color',
    text: 'Color',
    sort: true,
},{
    dataField: 'rarity',
    text: 'Rarity',
    sort: true,
},{
    dataField: 'image',
    text: 'Image',
    sort: true,
    formatter(cell, row) {
        if (row.reverse !== "None") {
            return <FlippingCard thisSide={cell} set={row.set} number={row.number}/>
        } else if (!cell) {
            return <img style={{borderRadius: 12, width: 225}} alt="No Card Image Available" aria-hidden src="cardback.jpg"></img>
        } else {
            return <img style={{borderRadius: 12}} alt="Card Face" aria-hidden src={cell}></img>
        }
    }
}];

export default columns;