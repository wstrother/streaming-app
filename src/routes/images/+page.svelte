<script lang="ts">
	import { supabase, userMeta } from "$lib/supabaseClient"
	import type { FileDropzoneEvents } from "@skeletonlabs/skeleton/dist/components/FileDropzone/FileDropzone.svelte";
	import type { PageData } from "./$types"
    import { getModalStore, getToastStore, FileDropzone } from '@skeletonlabs/skeleton'
    const modalStore = getModalStore()
    const toastStore = getToastStore()

    export let data: PageData
    let imageData = data.imageData
    let images: string[] = imageData.map(i => i.name)

    const getURI = (name: string): string => `${data.imageBaseUrl}${name}`

    const deleteImage = async (name: string, i: number) => {
        modalStore.trigger({
            type: 'confirm',
            title: `Delete ${name}?`,
            body: 'Confirm you want to delete this image. This is not reversible!',
            response: async (r: boolean) => {
                if (!r) return
                else {
                    const file_name = `${$userMeta.uid}/${name}`
                    const { error } = await supabase.storage.from('user_images')
                        .remove([file_name])
                    
                    if (error) throw new Error(error.message)
                    images.splice(i, 1)
                    images = images
                    toastStore.trigger({message: `${name} was deleted`})
                }
            }
        })
    }

    let files: FileList
    const onChange = async () => {
        console.log(files)
        if (files.length) {
            const fileName = files[0].name
            const { data, error } = await supabase.storage.from('user_images')
                .upload(`${$userMeta.uid}/${fileName}`, files[0])
            
            if (error) throw new Error(error.message)

            console.log(data)
            images.push(fileName)
            images = images
            toastStore.trigger({message: `${fileName}`})
        }

    }
</script>

<div id="images-container" class="scroll-auto flex flex-col overflow-y-scroll py-4 px-10 h-[90vh]">
    {#each images as image, i}
    <div class="bg-primary-600 rounded p-2 mb-1 text-white">
        <div class="flex items-center justify-between">
            <span class="font-bold">{image}</span>

            <button on:click={() => deleteImage(image, i)}
                class="btn btn-sm variant-filled-primary">
                delete
            </button>
        </div>
        <img src={getURI(image)} alt={image} />
    </div>
    {/each}
</div>

<div id="file-dropzone">
    <FileDropzone name="files" bind:files={files} on:change={onChange}/>
</div>

<style lang="postcss">
    #images-container {
        @apply m-4;
        width: 500px;
        z-index: 0;
    }

    #file-dropzone {
        @apply m-4 absolute;
        top: 0;
        left: 550px;
        width: 500px;
    }
</style>

