import Cards from "../components/Cards"
import { connect } from 'react-redux'

let mapStatetoProps = state => ({
    initialData: state.cardsReducer.initialData,
    data: state.cardsReducer.data,
    filter: state.cardsReducer.filter,
    search: state.cardsReducer.search,
    loading: state.cardsReducer.loading,
    updateView: state.cardsReducer.updateView
})

export default connect(mapStatetoProps)(Cards);