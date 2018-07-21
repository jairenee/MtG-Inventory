import React from 'react'
import { DropdownButton, MenuItem, InputGroup, Button, FormControl, HelpBlock } from 'react-bootstrap'

export class Filter extends React.Component {
    render() {
        let button;

        if (this.props.button) {
            button = (
                <InputGroup.Button>
                    <Button type="submit">Go!</Button>
                </InputGroup.Button>
            )
        }

        return (
            <form onSubmit={this.props.onSubmit}>
                <InputGroup>
                    <InputGroup.Button>
                        <DropdownButton
                            bsStyle="default"
                            title={this.props.defaultFilter}
                        >
                            {
                                this.props.filters.map((filter) => (
                                    <MenuItem eventKey={filter} onSelect={this.props.onSelect}>{filter}</MenuItem>
                                ))
                            }
                        </DropdownButton>
                    </InputGroup.Button>
                    <FormControl type="text" placeholder="Filter" onChange={this.props.onChange} />
                    {button}
                </InputGroup>
            </form>
        )
    }
}

export class SetList extends React.Component {
    render() {
        return (
            <InputGroup className="filter-list">
                <FormControl type="text" size="35" placeholder="Set List (CSV) e.g. m19,kld,aer" onChange={this.props.onChange}/>
                <HelpBlock>Use this to filter lists to specific sets ordered by release date. Useful for sorting large amounts of cards!</HelpBlock>
            </InputGroup>
        )
    }
}

// export class AddFilter extends React.Component {
//     render() {

//     }
// }