export default (ctx, inject) => {
  const $axios = ctx.$axios

  const plugin = {
    menu: {
      ui(params = {}) {
        return $axios
          .get('/ui', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err.response
          })
      }
    },
    auth: {
      login(params = {}) {
        return $axios
          .post('/auth/login', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err.response
          })
      },
      logout(params = {}) {
        return $axios
          .post('/auth/logout', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err.response
          })
      },
      register(params = {}) {
        return $axios
          .put('/auth/register', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err.response
          })
      },
      reset(params = {}) {
        return $axios
          .post('/auth/reset', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err.response
          })
      },
      restore(params = {}) {
        return $axios
          .post('/auth/reset/token', params)
          .then(res => {
            return res.data.meta
          })
          .catch(err => {
            return err.response
          })
      }
    },
    user: {
      get(params = {}) {
        return $axios
          .get('/user', params)
          .then(res => {
            return res.data.data
          })
          .then(err => {
            return err
          })
      },
      update(params = {}) {
        return $axios
          .post('/user', params)
          .then(res => {
            return res.data.data
          })
          .then(err => {
            return err
          })
      }
    },
    company: {
      get(params = {}) {
        return $axios
          .get('/company', params)
          .then(res => {
            return res.data.data
          })
          .then(err => {
            return err
          })
      },
      update(params = {}) {
        return $axios
          .post('/company', params)
          .then(res => {
            return res.data.data
          })
          .then(err => {
            return err
          })
      }
    },
    dataView: {
      get(params = {}) {
        return $axios
          .get('/data-view', { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      create(params = {}) {
        return $axios
          .get('/data-view/create', { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/data-view/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      update(id, params = {}) {
        return $axios
          .post(`/data-view/${id}`, params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteById(id, params = {}) {
        return $axios
          .delete(`/data-view/${id}`, params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      render(id) {
        return $axios
          .get(`/data-view/render/${id}`, {
            headers: {
              Accept: 'application/pdf'
            },
            responseType: 'arraybuffer'
          })
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      store(params = {}) {
        return $axios
          .put('/data-view', params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      }
    },
    recordGroups: {
      get(params = {}) {
        return $axios
          .get('/record-groups', { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/record-groups/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getCertificatesById(id, params = {}) {
        return $axios
          .get(`/record-groups/${id}/certificates`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteById(id, params = {}) {
        return $axios
          .delete(`/record-groups/${id}`, { params })
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      updateById(id, params = {}) {
        return $axios
          .post(`/record-groups/${id}`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      add(params = {}) {
        return $axios
          .put(`/record-groups/`, params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      }
    },
    recordLookups: {
      getRecordLookups(params = {}) {
        return $axios
          .get(`/record-lookups/`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      updateRecordLookups(id, params = {}) {
        return $axios
          .post(`/record-lookups/${id}`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      createRecordLookups(params = {}) {
        return $axios
          .put(`/record-lookups/custom`, params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteRecordLookups(id) {
        return $axios
          .delete(`/record-lookups/custom/${id}`)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      }
    },
    dataListDefaults: {
      getDataListDefaults(params = {}) {
        return $axios
          .get(`/data-list-defaults`, params)
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      }
    },
    dataGroups: {
      dataListGroups(params = {}) {
        return $axios
          .get(`/data-list-groups/`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/data-list-groups/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      }
    },
    roles: {
      get(params = {}) {
        return $axios
          .get(`/roles`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteById(id, params = {}) {
        return $axios
          .delete(`/roles/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/roles/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      updateById(id, params = {}) {
        return $axios
          .post(`/roles/${id}`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      getCreate(params = {}) {
        return $axios.get(`/roles/create`, { params }).then(res => {
          return res.data.data
        })
      },
      create(params = {}) {
        return $axios
          .put(`/roles`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      }
    },
    users: {
      get(params = {}) {
        return $axios
          .get(`/users`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteById(id, params = {}) {
        return $axios
          .delete(`/users/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/users/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      updateById(id, params = {}) {
        return $axios
          .post(`/users/${id}`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      create(params = {}) {
        return $axios
          .put(`/users`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      }
    },
    groups: {
      get(params = {}) {
        return $axios
          .get(`/groups`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      deleteById(id, params = {}) {
        return $axios
          .delete(`/groups/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      getById(id, params = {}) {
        return $axios
          .get(`/groups/${id}`, { params })
          .then(res => {
            return res.data.data
          })
          .catch(err => {
            return err
          })
      },
      updateById(id, params = {}) {
        return $axios
          .post(`/groups/${id}`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      },
      create(params = {}) {
        return $axios
          .put(`/groups`, params)
          .then(res => {
            return res
          })
          .catch(err => {
            return err
          })
      }
    },
    upload: {
      upload(params = {}) {
        return $axios
          .post(`/upload`, params)
          .then(res => {
            return res.data
          })
          .catch(err => {
            return err
          })
      },
      getImageByUrl(url) {
        return $axios
          .get(`/files/${url}`, {
            headers: {
              Accept: 'image/*'
            },
            responseType: 'blob'
          })
          .then(res => {
            return res.data
          })
          .catch(err => {
            return err
          })
      }
    }
  }

  ctx.$api = plugin
  inject('api', plugin)
}
