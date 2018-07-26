import update from 'immutability-helper';

const 
    setState = {
        initialData: null,
        data: null,
        filter: "Name",
        filterText: null,
        setsList: null
    },
    setsReducer = (state = setState, action) => {
        switch(action.type) {
            case "handleFilters":
            return update(state, {
                data: {$set: action.sets},
                filterText: {$set: action.filterText}
            })
            case "handleSets":
            return update(state, {
                data: {$set: action.sets},
                setsList: {$set: action.setsList}
            })
            case "setsMounted":
            return update(state, {
                initialData: {$set: action.sets},
                data: {$set: action.sets}
            })
            case "setSetsFilter":
            return update(state, {
                filter: {$set: action.filter}
            })
            default:
            return state;
        }
    }

export default setsReducer;
