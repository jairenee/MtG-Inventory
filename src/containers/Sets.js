import Sets from "../components/Sets"
import { connect } from 'react-redux'

let mapStatetoProps = state => ({
    initialData: state.setsReducer.initialData,
    data: state.setsReducer.data,
    filter: state.setsReducer.filter,
    filterText: state.setsReducer.filterText,
    setsList: state.setsReducer.setsList
})

export default connect(mapStatetoProps)(Sets);