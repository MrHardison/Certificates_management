export default (ctx, inject) => {
  const $axios = ctx.$axios

  const plugin = {
    menu: {
      async ui(params = {}) {
        try {
          const res = await $axios.get('/ui', params)
          return res.data.data
        } catch (e) {
          return e.response
        }
      }
    },
    auth: {
      async login(params = {}) {
        try {
          const res = await $axios.post('/auth/login', params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async logout(params = {}) {
        try {
          const res = await $axios.post('/auth/logout', params)
          return res.data.data
        } catch (e) {
          return e.response
        }
      },
      async register(params = {}) {
        try {
          const res = await $axios.put('/auth/register', params)
          return res.data.data
        } catch (e) {
          return e.response
        }
      },
      async reset(params = {}) {
        try {
          const res = await $axios.post('/auth/reset', params)
          return res.data.data
        } catch (e) {
          return e.response
        }
      },
      async restore(params = {}) {
        try {
          const res = await $axios.post('/auth/reset/token', params)
          return res.data.meta
        } catch (e) {
          return e.response
        }
      }
    },
    user: {
      async get(params = {}) {
        try {
          const res = await $axios.get('/user', params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async update(params = {}) {
        try {
          const res = await $axios.post('/user', params)
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    company: {
      async get(params = {}) {
        try {
          const res = await $axios.get('/company', params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async update(params = {}) {
        try {
          const res = await $axios.post('/company', params)
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    dataView: {
      async get(params = {}) {
        try {
          const res = await $axios.get('/data-view', { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async create(params = {}) {
        try {
          const res = await $axios.get('/data-view/create', { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/data-view/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async update(id, params = {}) {
        try {
          const res = await $axios.post(`/data-view/${id}`, params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteById(id, params = {}) {
        try {
          const res = await $axios.delete(`/data-view/${id}`, params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async render(id) {
        try {
          const res = await $axios.get(`/data-view/render/${id}`, {
            headers: {
              Accept: 'application/pdf'
            },
            responseType: 'arraybuffer'
          })
          return res
        } catch (e) {
          return e
        }
      },
      async store(params = {}) {
        try {
          const res = await $axios.put('/data-view', params)
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    recordGroups: {
      async get(params = {}) {
        try {
          const res = await $axios.get('/record-groups', { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/record-groups/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getCertificatesById(id, params = {}) {
        try {
          const res = await $axios.get(`/record-groups/${id}/certificates`, {
            params
          })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteById(id, params = {}) {
        try {
          const res = await $axios.delete(`/record-groups/${id}`, { params })
          return res
        } catch (e) {
          return e
        }
      },
      async updateById(id, params = {}) {
        try {
          const res = await $axios.post(`/record-groups/${id}`, params)
          return res
        } catch (e) {
          return e
        }
      },
      async add(params = {}) {
        try {
          const res = await $axios.put(`/record-groups/`, params)
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    recordLookups: {
      async getRecordLookups(params = {}) {
        try {
          const res = await $axios.get(`/record-lookups/`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async updateRecordLookups(id, params = {}) {
        try {
          const res = await $axios.post(`/record-lookups/${id}`, params)
          return res
        } catch (e) {
          return e
        }
      },
      async createRecordLookups(params = {}) {
        try {
          const res = await $axios.put(`/record-lookups/custom`, params)
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteRecordLookups(id) {
        try {
          const res = await $axios.delete(`/record-lookups/custom/${id}`)
          return res
        } catch (e) {
          return e
        }
      }
    },
    dataListDefaults: {
      async getDataListDefaults(params = {}) {
        try {
          const res = await $axios.get(`/data-list-defaults`, params)
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    dataGroups: {
      async dataListGroups(params = {}) {
        try {
          const res = await $axios.get(`/data-list-groups/`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/data-list-groups/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      }
    },
    roles: {
      async get(params = {}) {
        try {
          const res = await $axios.get(`/roles`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteById(id, params = {}) {
        try {
          const res = await $axios.delete(`/roles/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/roles/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async updateById(id, params = {}) {
        try {
          const res = await $axios.post(`/roles/${id}`, params)
          return res
        } catch (e) {
          return e
        }
      },
      async getCreate(params = {}) {
        try {
          const res = await $axios.get(`/roles/create`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async create(params = {}) {
        try {
          const res = await $axios.put(`/roles`, params)
          return res
        } catch (e) {
          return e
        }
      }
    },
    users: {
      async get(params = {}) {
        try {
          const res = await $axios.get(`/users`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteById(id, params = {}) {
        try {
          const res = await $axios.delete(`/users/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/users/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async updateById(id, params = {}) {
        try {
          const res = await $axios.post(`/users/${id}`, params)
          return res
        } catch (e) {
          return e
        }
      },
      async create(params = {}) {
        try {
          const res = await $axios.put(`/users`, params)
          return res
        } catch (e) {
          return e
        }
      }
    },
    groups: {
      async get(params = {}) {
        try {
          const res = await $axios.get(`/groups`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async deleteById(id, params = {}) {
        try {
          const res = await $axios.delete(`/groups/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async getById(id, params = {}) {
        try {
          const res = await $axios.get(`/groups/${id}`, { params })
          return res.data.data
        } catch (e) {
          return e
        }
      },
      async updateById(id, params = {}) {
        try {
          const res = await $axios.post(`/groups/${id}`, params)
          return res
        } catch (e) {
          return e
        }
      },
      async create(params = {}) {
        try {
          const res = await $axios.put(`/groups`, params)
          return res
        } catch (e) {
          return e
        }
      }
    },
    upload: {
      async upload(params = {}) {
        try {
          const res = await $axios.post(`/upload`, params)
          return res.data
        } catch (e) {
          return e
        }
      },
      async getImageByUrl(url = {}) {
        try {
          const res = await $axios.get(`/files/${url}`, {
            headers: {
              Accept: 'image/*'
            },
            responseType: 'blob'
          })
          return res.data
        } catch (e) {
          return e
        }
      }
    }
  }

  ctx.$api = plugin
  inject('api', plugin)
}
