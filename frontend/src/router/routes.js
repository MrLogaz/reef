
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
      { name: 'empty', path: '', redirect: 'gift' },
      { name: 'gift', path: 'gift', component: () => import('pages/Gift.vue'), params: true },
      { name: 'receive', path: 'receive', component: () => import('pages/Receive.vue'), params: true },
      { name: 'settings', path: 'settings', component: () => import('pages/Settings.vue'), params: true },
      { name: 'category', path: 'category/:categoryId', component: () => import('pages/Category.vue'), params: true },
      { name: 'product-phone', path: 'product/phone', component: () => import('pages/Gift/Biptophone.vue'), params: true },
      { name: 'minter', path: 'product/minter', component: () => import('pages/Gift/MinterSend.vue'), params: true },
      { name: 'product', path: 'product/:productId', component: () => import('pages/Gift/Product.vue'), params: true }
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
