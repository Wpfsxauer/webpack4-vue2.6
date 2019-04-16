import * as types from './mutation-types'
export const setUpdate = function ({commit}, data) {
  commit({type: types.UPDATE, data})
}