import Vue from 'vue'
import Router from 'vue-router'

import Search from './components/search/Search.vue'
import Tree from './components/tree/Tree.vue'
import Organisation from './components/organisation/Organisation.vue'
import Person from './components/person/Person.vue'
import SomethingWrong from './components/error/SomethingWrong.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: {
                name: 'orgchart',
                query: {
                    root: process.env.VUE_APP_ROOT_UUID,
                    org: process.env.VUE_APP_ROOT_UUID,
                    showchildren: 1
                }
            }
        },
        {
            path: '/orgchart',
            name: 'orgchart',
            components: {
                tree: Tree,
                organisation: Organisation,
                person: Person
            }
        },
        {
            path: '/search',
            name: 'search',
            components: {
                search: Search
            }
        },
        {
            path: '/error',
            name: '404',
            components: {
                error: SomethingWrong
            }
        },
        {
            path: '*',
            redirect: '/error'
        }
    ]
})

export default router