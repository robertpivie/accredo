signin = () => {
    document.getElementById("phone").focus();

    getPasscode = (form) => {
        const data = OۆO.getData(form);
        window.location.hash='sign-in-2';
    }
}
signin();