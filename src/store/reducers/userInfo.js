import * as types from '../constants'

const initialState = {
  id: null,
  phone: '',
  username: '',
  createTime: null,
  updateTime: null,
}
const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN: {
      return {
        ...state,
        ...action.payload
      }
    }
    case types.LOGOUT: {
      return {}
    }
    default:
      return state
  }
}


export default userInfo
