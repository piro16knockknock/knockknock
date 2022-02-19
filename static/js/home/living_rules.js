
var myGuidlineModal = document.getElementById('guidelinemodal');
var myGuidlineModalContainer = new bootstrap.Modal(myGuidlineModal);
if (is_show_modal){
    myGuidlineModalContainer.show();
}

myGuidlineModal.addEventListener('hidden.bs.modal', () => {
    myGuidlineModalContainer.hide();
})
