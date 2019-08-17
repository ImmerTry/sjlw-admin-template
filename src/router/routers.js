import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },
  {
    path: '/content',
    name: 'content',
    meta: {
      icon: 'ios-paper',
      title: '内容'
    },
    component: Main,
    children: [
      {
        path: '/article_list',
        name: 'article_list',
        meta: {
          icon: 'ios-book',
          title: '文章列表'
        },
        component: () => import('@/view/contents/article-list.vue')
      },
      {
        path: '/classified',
        name: 'classified_management',
        meta: {
          icon: 'ios-apps',
          title: '分类管理'
        },
        component: () => import('@/view/contents/classified.vue')
      },
      {
        path: '/comment',
        name: 'comment_management',
        meta: {
          icon: 'ios-bookmark',
          title: '新闻发布'
        },
        component: () => import('@/view/contents/comment.vue')
      }
    ]
  },
  {
    path: '/picture',
    name: 'picture',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: '/picture_m',
        name: 'picture_management',
        meta: {
          icon: 'ios-images',
          title: '图片管理'
        },
        component: () => import('@/view/picture-m/picture-m.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'ios-contact',
      title: '用户'
    },
    component: Main,
    children: [
      {
        path: '/role',
        name: 'role_management',
        meta: {
          icon: 'ios-people',
          title: '角色管理'
        },
        component: () => import('@/view/user/role-m.vue')
      },
      {
        path: '/back_stage',
        name: 'back_stage_management',
        meta: {
          // access: ['1'],
          icon: 'ios-contacts',
          title: '后台管理'
        },
        component: () => import('@/view/user/back-stage.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      icon: 'ios-construct',
      title: '设置'
    },
    component: Main,
    children: [
      {
        path: '/system_setup',
        name: 'system_setup',
        meta: {
          icon: 'ios-settings',
          title: '系統设置',
          showAlways: true
        },
        component: parentView,
        children: [
          {
            path: '/website_setup',
            name: 'website_setup',
            meta: {
              // access: ['1'],
              icon: 'md-funnel',
              title: '网站设置'
            },
            component: () => import('@/view/settting/website-setup.vue')
          }
        ]
      },
      {
        path: '/setting',
        name: 'my_settings',
        meta: {
          icon: 'ios-person',
          title: '我的设置',
          showAlways: true
        },
        component: parentView,
        children: [
          {
            path: '/basic_data',
            name: 'basic_data',
            meta: {
              icon: 'ios-settings',
              title: '基本资料'
            },
            component: () => import('@/view/settting/basic-data.vue')
          },
          {
            path: '/modify_password',
            name: 'modify_password',
            meta: {
              icon: 'ios-settings',
              title: '修改密码'
            },
            component: () => import('@/view/settting/modify-password.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
