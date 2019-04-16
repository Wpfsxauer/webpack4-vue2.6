import * as types from './mutation-types'

export default {
  [types.UPDATE](state,{data}){
      state.update=data
  }
}