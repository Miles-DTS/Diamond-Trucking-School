document.addEventListener('DOMContentLoaded', () => {
    const myButton = document.getElementById('myButton');
    if (myButton) {
        myButton.addEventListener('click', () => {
            alert('Button clicked! You are learning JavaScript!');
        });
    }
});