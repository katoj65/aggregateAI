import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { supabase } from '@/database/database'
import { hasProfileForEmail } from '@/utils/profileStatus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/WelcomePage.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue')
  },
  {
    path: '/forgot-password',
    component: () => import('@/views/ForgotPasswordPage.vue')
  },
  {
    path: '/chat',
    component: () => import('@/views/ChatPage.vue')
  },
  {
    path: '/subjects',
    component: () => import('@/views/SubjectsPage.vue')
  },
  {
    path: '/subjects/:id',
    component: () => import('@/views/SubjectProfilePage.vue')
  },
  {
    path: '/subjects/:id/learn',
    component: () => import('@/views/StartLearningPage.vue')
  },
  {
    path: '/practice',
    component: () => import('@/views/PracticePage.vue')
  },
  {
    path: '/progress',
    component: () => import('@/views/ProgressPage.vue')
  },
  {
    path: '/notifications',
    component: () => import('@/views/NotificationPage.vue')
  },
  {
    path: '/timetable',
    component: () => import('@/views/TimetablePage.vue')
  },
  {
    path: '/create-profile',
    component: () => import('@/views/CreateProfilePage.vue')
  },
  {
    path: '/create-student-details',
    component: () => import('@/views/CreateStudentDetails.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/Tab4Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const { data, error } = await supabase.auth.getSession()
  const guestOnlyPaths = new Set(['/', '/login', '/register', '/forgot-password'])
  const protectedPaths = ['/chat', '/subjects', '/practice', '/progress', '/notifications', '/create-profile', '/create-student-details', '/timetable']
  const isProtected = protectedPaths.some(p => to.path.startsWith(p))
  const isLoggedIn = Boolean(data.session)

  if (error) {
    console.error('Failed to check auth session:', error)
  }

  if ((to.path.startsWith('/tabs') || isProtected) && !isLoggedIn) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }

  if (isLoggedIn) {
    let profileExists = false
    const userEmail = data.session.user.email || ''

    if (userEmail) {
      try {
        profileExists = await hasProfileForEmail(userEmail)
      } catch (profileError) {
        console.error('Failed to check profile status:', profileError)
      }
    }

    if (!profileExists && to.path !== '/create-profile') {
      return '/create-profile'
    }

    if (profileExists && (guestOnlyPaths.has(to.path) || to.path === '/create-profile')) {
      return '/tabs/tab1'
    }
  }

  return true
})

export default router
