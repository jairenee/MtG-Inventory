import Cards from "../components/Cards"
import { connect } from 'react-redux'

let mapStatetoProps = state => {
    let props = {}
    Object.keys(state.cards).map(key => {
        props[key] = state.cards[key];
    })
    return props
}

export default connect(mapStatetoProps)(Cards);