import moment from 'moment'
export default ({ axios }, inject) => {
  const timezone = data => {
    if (data) {
      const calcTime = date => {
        let offsetHours = moment().utcOffset() / 60
        let serverDate = moment(date)
        return serverDate.add(offsetHours, 'hours').format('YYYY-MM-DD H:mm:ss')
      }
      data.data.forEach(item => {
        Object.keys(item).forEach(key => {
          if (
            key.includes('lastlogin') ||
            key.includes('created_at') ||
            key.includes('updated_at') ||
            key.includes('deleted_at')
          ) {
            item[key] = calcTime(item[key])
          }
        })
      })
      return data
    } else {
      return ''
    }
  }
  inject('timezone', timezone)
}
