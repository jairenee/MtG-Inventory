import Sets from "../components/Sets"
import { connect } from 'react-redux'

let mapStatetoProps = state => {
    return Object.keys(state.sets).reduce(function(props, key) {
        props[key] = state.sets[key]
        return props;
    }, {});
}

export default connect(mapStatetoProps)(Sets);