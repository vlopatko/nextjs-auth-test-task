import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  isAuth: boolean
  username: string
  uid: string
}

interface InitialState {
  value: AuthState
}

const initialState = {
  value: {
    isAuth: false,
    username: '',
    uid: '',
  } as AuthState,
} as InitialState

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      return initialState
    },
    logIn: (_, action: PayloadAction<string>) => {
      return {
        value: {
          isAuth: true,
          username: action.payload,
          uid: crypto.randomUUID(),
        },
      }
    },
  },
})

export const { logOut, logIn } = auth.actions
export default auth.reducer
