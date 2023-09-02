import type { ModalStore } from '@skeletonlabs/skeleton'
import type { LayoutNodeProxy } from './classes/layoutNodes'
import type { StateVariableProxy, StateVarStore } from './classes/stateVariables'
import { get } from 'svelte/store'

export const setParentID = (node: LayoutNodeProxy, modalStore: ModalStore) => {
    modalStore.trigger({
        type: 'component',
        component: 'fullNodeList',
        meta: {
            onClick: (e: CustomEvent) => {
                node.setColumn("parent_node_id", e.detail.id)
                modalStore.close()
            },
            exclude: [node.id, node.parent_node_id]
        }
    })
}

export const unsetParentID = (node: LayoutNodeProxy) => {
    node.setColumn("parent_node_id", null)
}

export const orderChildNodes = (parentNode: LayoutNodeProxy, modalStore: ModalStore) => {
    modalStore.trigger({
        type: 'component',
        component: 'orderChildNodes',
        meta: {parentNode}
    })
}

export const setVariableID = (node: LayoutNodeProxy, modalStore: ModalStore) => {
    modalStore.trigger({
        type: 'component',
        component: 'fullVarsList',
        meta: {
            onClick: (sv: StateVariableProxy) => {
                node.setColumn("variable_id", sv.id)
                modalStore.close()
            }
        }
    })
}

export const unsetVariableID = (node: LayoutNodeProxy) => {
    node.setColumn("variable_id", null)
}

export const setBooleanID = (node: LayoutNodeProxy, modalStore: ModalStore) => {
    modalStore.trigger({
        type: 'component',
        component: 'fullVarsList',
        meta: {
            onClick: (sv: StateVariableProxy) => {
                node.setColumn("boolean_id", sv.id)
                modalStore.close()
            },
            typeFilter: "boolean"
        }
    })
}

export const toggleBoolean = (node: LayoutNodeProxy, svObj: StateVarStore) => {
    const stateVariables = get(svObj)
    if (node.boolean_id) {
        const bool = svObj.getProxyByID(stateVariables, node.boolean_id)
        bool.setColumn("value", String(!bool.value))
        bool.saveChangesToDB()
    }
}

export const unsetBooleanID = (node: LayoutNodeProxy) => {
    node.setColumn("boolean_id", null)
}

export const setImageSrc = (node: LayoutNodeProxy, modalStore: ModalStore) => {

}

export const unsetImageSrc = (node: LayoutNodeProxy) => {
    node.setColumn("img_src", null)
}