import Sets from "../components/Sets"
import { connect } from 'react-redux'

let mapStatetoProps = state => {
    let props = {}
    Object.keys(state.sets).map(key => {
        props[key] = state.sets[key];
    })
    return props
}

export default connect(mapStatetoProps)(Sets);