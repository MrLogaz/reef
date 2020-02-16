
const routes = [
  {
    path: '/start',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), params: true }
    ]
  },
  {
    path: '/gift',
    component: () => import('layouts/Gift.vue'),
    children: [
      { path: '', component: () => import('pages/Gift/Index.vue'), params: true },
      { path: 'biptophone', component: () => import('pages/Gift/Biptophone.vue') }
    ]
  },
  {
    path: '/api',
    component: () => import('layouts/Api.vue'),
    children: [
      { path: '', component: () => import('pages/Api/Index.vue') },
      { path: 'biptophone', component: () => import('pages/Api/BipToPhone.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', redirect: '/start' }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  })
}

export default routes
