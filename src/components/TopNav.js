import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { SyncButton } from "./Buttons"

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
            </Nav>
            <Nav pullRight>
              <NavItem>
                <SyncButton type="sets" />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
  }