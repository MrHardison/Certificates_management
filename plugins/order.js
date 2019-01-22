export default ({ $axios }, inject) => {
  const order = data => {
    return _.orderBy(data, 'sequence_order')
  }
  inject('order', order)
  const orderObject = obj_param => {
    const obj = Object.assign({}, obj_param)
    const ordered_keys = getKeysOrder(obj_param)
    return _.reduce(
      ordered_keys,
      (result, value) => {
        result[value] = obj[value]
        return result
      },
      {}
    )
  }
  const getKeysOrder = obj_param => {
    const obj = Object.assign({}, obj_param)
    const temp = _.reduce(
      obj,
      (result, value, key) => {
        result.push({
          key: key,
          sequence_order: value.sequence_order
        })
        return result
      },
      []
    )
    const ordered_temp = _.orderBy(temp, 'sequence_order')
    return _.map(ordered_temp, 'key')
  }
  inject('orderObject', orderObject)
}
