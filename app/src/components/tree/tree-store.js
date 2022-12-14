import Vue from "vue"
import { postQuery } from "../http/http.js"

const setParentOrgUnitVisibility = function (parent_uuid) {
  let new_parent = state.org_units[parent_uuid]
  new_parent.showchildren = true
  if (new_parent.parent !== null) {
    setParentOrgUnitVisibility(new_parent.parent.uuid)
  }
  mutations.setOrgUnit(state, new_parent)
}

const setOrgUnitVisibility = function (route) {
  // Set `showchildren` true for org.unit that is focused according to route params
  // Then check its parents and set `showchildren` for them as well
  if (route) {
    let focused_org = state.org_units[route.params.orgUnitId]
    if (route.query.showchildren === "false") {
      // Do nothing
    } else {
      focused_org.showchildren = true
    }
    if (focused_org.parent) {
      setParentOrgUnitVisibility(focused_org.parent.uuid)
    }
    mutations.setOrgUnit(state, focused_org)
  }
}

const onLoadEndHandler = function (route) {
  // This is the last thing we do when building Tree
  setOrgUnitVisibility(route)
  mutations.setTreeLoadSTatus(state, false)
}

const state = {
  root_uuid: OC_GLOBAL_CONF.VUE_APP_ROOT_UUID,
  org_unit_hierarchy_uuids: OC_GLOBAL_CONF.VUE_ORG_UNIT_HIERARCHY_UUIDS,
  org_units: {},
  tree_is_loading: false,
}

const getters = {
  getOrgUnits: (state) => {
    return state.org_units
  },
  getRootUuid: (state) => {
    return state.root_uuid
  },
  getOrgUnitHierarchyUuid: (state) => {
    return state.org_unit_hierarchy_uuids
  },
  getTreeOrgUnit: (state) => (uuid) => {
    return state.org_units[uuid]
  },
  getTreeLoadStatus: (state) => {
    return state.tree_is_loading
  },
}
const mutations = {
  setRootUuid: (state, uuid) => {
    state.root_uuid = uuid
  },
  setOrgUnit: (state, org_unit) => {
    let new_org = Object.assign({}, org_unit, state.org_units[org_unit.uuid])
    Vue.set(state.org_units, org_unit.uuid, new_org)
  },
  setOrgUnits: (state, org_units) => {
    if (org_units.length) {
      let new_orgs = Object.assign({}, state.org_units)
      for (let org of org_units) {
        if (!new_orgs[org.uuid]) {
          new_orgs[org.uuid] = org
        } else {
          new_orgs[org.uuid] = Object.assign({}, new_orgs[org.uuid], org)
        }
      }
      state.org_units = new_orgs
    }
  },
  setTreeLoadSTatus: (state, status_bool) => {
    state.tree_is_loading = status_bool
  },
}
const actions = {
  buildTree: ({ commit, state, dispatch }, { uuids, route }) => {
    // Assumes `uuids` is an array

    commit("setTreeLoadSTatus", true)

    const uuid_set = new Set(uuids) // Creating a Set removes duplicate uuids
    let uuid_query_str = ""
    uuid_set.forEach(function (uuid) {
      if (!state.org_units[uuid]) {
        // Only add uuid to query if data does not exist in state
        uuid_query_str += `"${uuid}",`
      }
    })
    if (uuid_query_str.length > 0) {
      dispatch("fetchOrgUnitsInTree", uuid_query_str).then((orgs) => {
        commit("setOrgUnits", orgs)

        // Check if orgs have parents we need to fetch
        let additional_uuids = orgs
          .filter(function (org) {
            return org.parent !== null
          })
          .map(function (org) {
            return org.parent.uuid
          })

        // Rerun if additional uuids are wanted
        if (additional_uuids.length > 0) {
          dispatch("buildTree", { uuids: additional_uuids, route: route })
        } else {
          // This is the next to last thing we do when building Tree
          dispatch("fetchVisibleOrgUnitChildren", route)
        }
      })
    } else {
      // This is the next to last thing we do when building Tree
      dispatch("fetchVisibleOrgUnitChildren", route)
    }
  },
  fetchOrgUnitsInTree: ({ rootState }, uuids) => {
    let relation_query_str = ""
    let hierarchies_filter = rootState.org_unit_hierarchy_uuids
      ? `, hierarchies: ${rootState.org_unit_hierarchy_uuids}`
      : ""
    let hierarchies_filter_children = rootState.org_unit_hierarchy_uuids
      ? `(hierarchies: ${rootState.org_unit_hierarchy_uuids})`
      : ""
    if (rootState.relation_type === "engagement") {
      relation_query_str = `
                engagements {
                    uuid
                }
            `
    } else {
      relation_query_str = `
                associations {
                    uuid
                }
            `
    }
    return postQuery({
      query: `
            {
                org_units(uuids: [${uuids}] ${hierarchies_filter}) {
                    uuid
                    objects {
                        name
                        parent {
                            uuid
                        }
                        children ${hierarchies_filter_children} {
                            uuid
                        }
                        org_unit_level_uuid
                        ${relation_query_str}
                    }
                }
            }
        `,
    }).then((res) => {
      if (!res) {
        return []
      }

      if (OC_GLOBAL_CONF.VUE_APP_HIDE_ORG_UNIT_UUIDS) {
        res["org_units"] = res["org_units"].filter((org) => {
          if (OC_GLOBAL_CONF.VUE_APP_HIDE_ORG_UNIT_UUIDS.includes(org.uuid)) {
            return false
          }
          return true
        })
      }
      // TODO: FIX THIS CODE AFTER WE FIXED ENV VARIABLES
      // https://redmine.magenta-aps.dk/issues/54117
      // Remove org_units with names that has `_leder`, `??_`, `_adm`, `_COVID` or `_vikar` in it
      if (OC_GLOBAL_CONF.VUE_APP_HIDE_MANAGER_ORG_UNITS == "true") {
        // Since VUE can't understand lists from docker-compose, I'm manually removing these
        let substrings = ["_leder", "??_", "_adm", "_COVID", "_vikar"]
        res["org_units"] = res["org_units"].filter((org) => {
          for (let i = 0; i < substrings.length; i++) {
            if (org.objects[0].name.includes(substrings[i])) {
              return false
            }
          }
          return true
        })
      }

      // Remove specific org_unit_levels from orgviewer
      if (OC_GLOBAL_CONF.VUE_APP_HIDE_ORG_UNIT_LEVELS) {
        res["org_units"] = res["org_units"].filter((org) => {
          if (
            OC_GLOBAL_CONF.VUE_APP_HIDE_ORG_UNIT_LEVELS.includes(
              org.objects[0].org_unit_level_uuid
            )
          ) {
            return false
          }
          return true
        })
      }

      return res["org_units"].map((org) => {
        let obj = org.objects[0]
        obj.uuid = org.uuid
        return obj
      })
    })
  },
  fetchVisibleOrgUnitChildren: ({ commit, state, dispatch }, route) => {
    let additional_child_uuids = new Set()

    const cycle_parents = function (child_uuids, org_unit) {
      const org_unit_from_state = state.org_units[org_unit.uuid]
      org_unit_from_state.children.forEach(function (child) {
        child_uuids.add(child.uuid)
      })
      // Checking that org unit uuid is not null and not identitical to its parent's
      if (
        org_unit_from_state.parent !== null &&
        org_unit_from_state.parent.uuid !== org_unit_from_state.uuid
      ) {
        cycle_parents(child_uuids, org_unit_from_state.parent)
      }
    }

    if (route && route.params.orgUnitId) {
      const org_unit = state.org_units[route.params.orgUnitId]
      org_unit.children.forEach(function (child) {
        additional_child_uuids.add(child.uuid)
      })
      if (org_unit.parent !== null) {
        cycle_parents(additional_child_uuids, org_unit.parent)
      }
    } else {
      state.org_units[state.root_uuid].children.forEach(function (child) {
        additional_child_uuids.add(child.uuid)
      })
    }

    // When we have a list of uuids, fetch them
    let uuid_query_str = ""
    additional_child_uuids.forEach(function (uuid) {
      if (!state.org_units[uuid]) {
        // Only add uuid to query if data does not exist in state
        uuid_query_str += `"${uuid}",`
      }
    })
    if (uuid_query_str.length > 0) {
      dispatch("fetchOrgUnitsInTree", uuid_query_str).then((orgs) => {
        commit("setOrgUnits", orgs)
        onLoadEndHandler(route)
      })
    } else {
      onLoadEndHandler(route)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
