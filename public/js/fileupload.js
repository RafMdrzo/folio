FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
    
    );

FilePond.setOptions({
    imagePreviewHeight: 250,
    imageResizeTargetWidth: 640,
    imageResizeTargetHeight: 480
})
FilePond.parse(document.body)