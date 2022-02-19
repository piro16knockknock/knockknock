// Modal

var is_true = '{{show_modal}}';

if (is_true){
    var myModal = new bootstrap.Modal(document.getElementById('guidelinemodal'));
    myModal.show();
}

function skipButton() {
    document.querySelector('.modal-backdrop').stlyle.opacity=0;
}