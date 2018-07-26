import Sets from "../components/Sets"
import { connect } from 'react-redux'

let mapStatetoProps = state => ({
    initialData: state.sets.initialData,
    data: state.sets.data,
    filter: state.sets.filter,
    filterText: state.sets.filterText,
    setsList: state.sets.setsList
})

export default connect(mapStatetoProps)(Sets);