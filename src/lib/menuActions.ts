// import { getModalStore } from '@skeletonlabs/skeleton'
import type { ModalStore } from '@skeletonlabs/skeleton'
import type { LayoutNodeProxy } from './classes/layoutNodes'
// const modalStore = getModalStore()

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

}

export const unsetVariableID = (node: LayoutNodeProxy) => {
    node.setColumn("variable_id", null)
}

export const setBooleanID = (node: LayoutNodeProxy, modalStore: ModalStore) => {

}

export const unsetBooleanID = (node: LayoutNodeProxy) => {
    node.setColumn("boolean_key", null)
}

export const setImageSrc = (node: LayoutNodeProxy, modalStore: ModalStore) => {

}

export const unsetImageSrc = (node: LayoutNodeProxy) => {
    node.setColumn("img_src", null)
}