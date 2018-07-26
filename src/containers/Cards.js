import Cards from "../components/Cards"
import { connect } from 'react-redux'

let mapStatetoProps = state => ({
    initialData: state.cards.initialData,
    data: state.cards.data,
    filter: state.cards.filter,
    search: state.cards.search,
    loading: state.cards.loading,
    updateView: state.cards.updateView
})

export default connect(mapStatetoProps)(Cards);