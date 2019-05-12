import * as types from '../constants'

export const updateUserInfo = (payload) => ({
  type: types.UPDATE,
  payload,
})