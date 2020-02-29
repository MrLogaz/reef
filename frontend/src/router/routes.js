
const routes = [
  {
    path: '/api',
    component: () => import('layouts/Api.vue'),
    children: [
      { path: '', component: () => import('pages/Api/Index.vue') },
      { path: 'biptophone', component: () => import('pages/Api/BipToPhone.vue') },
      { path: 'ozon', component: () => import('pages/Api/Ozon.vue') }
    ]
  },
  {
    path: '/:seed',
    component: () => import('layouts/Client.vue'),
    children: [
      { name: 'gift', path: '', component: () => import('pages/Gift.vue'), params: true },
      { name: 'recive', path: 'recive', component: () => import('pages/Recive.vue'), params: true },
      { name: 'settings', path: 'settings', component: () => import('pages/Settings.vue'), params: true },
      { name: 'category', path: 'category/:categoryId', component: () => import('pages/Category.vue'), params: true },
      { name: 'product', path: 'product/:productId', component: () => import('pages/Product.vue'), params: true }
    ]
  },
  {
    path: '*',
    component: () => import('layouts/Client.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('layouts/Client.vue'),
    children: [
      { path: '', component: () => import('pages/Start.vue') }
    ]
  })
}

export default routes
