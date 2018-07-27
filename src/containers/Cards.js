import Cards from "../components/Cards"
import { connect } from 'react-redux'

let mapStatetoProps = state => {
    return Object.keys(state.cards).reduce(function(props, key) {
        props[key] = state.cards[key]
        return props;
    }, {});
}

export default connect(mapStatetoProps)(Cards);