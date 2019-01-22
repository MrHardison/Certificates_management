export default ({ $axios, redirect, store }) => {
  $axios.setHeader('Applicationtype', 'web')
  $axios.setHeader('Applicationversion', 'Browser v3.2')
}
