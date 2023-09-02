import { getModalStore } from '@skeletonlabs/skeleton'
import type { LayoutNodeProxy } from './classes/layoutNodes'
const modalStore = getModalStore()

export const setParentID = (node: LayoutNodeProxy) => {
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