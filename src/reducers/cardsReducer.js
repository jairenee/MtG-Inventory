import update from 'immutability-helper';

const 
    setState = {
        initialData: null,
        data: null,
        filter: "Name",
        search: null,
        loading: false,
        updateView: false,
        donteven: false
    }, 
    cardsReducer = (state = setState, action) => {
        switch(action.type) {
            case "dontEven":
            return update(state, {
                donteven: {$set: true}
            })
            case "updateSearch":
            return update(state, {
                search: {$set: action.search}
            })
            case "handleSearch":
            return update(state, {
                data: {$set: action.sets},
                loading: {$set: false}
            })
            case "setLoading":
            return update(state, {
                loading: {$set: true},
                donteven: {$set: false}
            })
            case "setCardsFilter":
            return update(state, {
                filter: {$set: action.filter},
                updateView: {$set: action.updateView}
            })
            case "updateView":
            return update(state, {
                updateView: {$set: action.updateView}
            })
            default:
            return state;
        }
    }

export default cardsReducer