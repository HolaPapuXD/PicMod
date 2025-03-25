document.addEventListener('DOMContentLoaded', () => {
    // Handle Start Editing button
    const startEditingBtn = document.querySelector('#startEditingBtn');
    if (startEditingBtn) {
        startEditingBtn.addEventListener('click', () => {
            window.location.href = 'editor.html';
        });
    }

    // Handle image upload
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('border-blue-500');
        }

        function unhighlight(e) {
            dropZone.classList.remove('border-blue-500');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.querySelector('.image-preview');
                        if (preview) {
                            preview.src = e.target.result;
                            preview.classList.remove('hidden');
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please upload an image file');
                }
            }
        }
    }
}); 