export default ({ store, redirect }) => {
  if (store.getters['token/getApiToken'] === false) {
    return redirect('/auth/login')
  }
}
