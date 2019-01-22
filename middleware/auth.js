export default ({ store, redirect }) => {
  if (store.getters['token/getApiToken']) {
    return redirect('/')
  }
}
