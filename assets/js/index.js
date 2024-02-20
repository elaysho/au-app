$(document).ready(function() {
    auapp.init();

    let photos = localStorage.getItem('photos') ?? JSON.stringify({});
    photos = JSON.parse(photos);
    console.log(photos);

    // localStorage.removeItem('messages');
});