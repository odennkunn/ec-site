import {auth, FirebaseTimestamp, db} from "../../firebase/index"
import { push } from "connected-react-router"
import {signInAction} from './actions'


//アカウント作成
export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      alert("必須項目が未入力です")
      return false
    }

    if (password !== confirmPassword) {
      alert("パスワードと確認用パスワードが一致しません。もう一度お試しください。")
      return false
    }

    return auth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user
        if (user) {
          const uid = user.uid
          const timestamp = FirebaseTimestamp.now()

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username
          }

          db.collection('users').doc(uid).set(userInitialData)
            .then(() => {
              dispatch(push('/'))
            })
        }
      })
  }
}

//サインイン
export const signIn = (email, password) => {
  return async (dispatch) => {
    if (email === "" || password === "") {
      alert('必須項目が未入力です')
      return false
    }

    auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        const user = result.user

        if (user) {
          const uid = user.uid
          db.collection('users').doc(uid).get()
            .then(snapshot => {
              const data = snapshot.data()

              dispatch(signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username
              }))
              dispatch(push('/'))
            })
        }
      })
  }
}