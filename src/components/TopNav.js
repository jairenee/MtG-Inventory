import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { SyncButton, ClearButton } from "./Buttons"

export class TopNav extends React.Component {
    render() {
      return (
        <Navbar staticTop fluid inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">MtG Inventory</Link>
            </Navbar.Brand>        
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer exact to="/">
                <NavItem>Home</NavItem>
              </LinkContainer>
              <LinkContainer to="/sets">
                <NavItem>Sets</NavItem>
              </LinkContainer>
              <LinkContainer to="/cards">
                <NavItem>Cards</NavItem>
              </LinkContainer>
              <LinkContainer to="/inventory">
                <NavItem>Inventory</NavItem>
              </LinkContainer>
              <LinkContainer to="/decks">
                <NavItem>Decks</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem>
                <SyncButton type="sets" />
                <SyncButton type="cards" />
                <ClearButton />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
  }