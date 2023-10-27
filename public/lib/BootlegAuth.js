export default class BootlegAuth {
    _onAuthComplete = () => {}
    authWindow = null
    
    openWindow() {
        const h = 500, w = 350;
		const left = (screen.width / 2) - ( w / 2);
		const top = (screen.height / 2) - (h / 2);

        window.addEventListener("message", this.authComplete.bind(this));

        this.authWindow = window.open(
          'https://repl.it/auth_with_repl_site?domain='+location.host,
          '_blank',
          'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
    }

    onAuthComplete(cb) {
        this._onAuthComplete = cb
    }

    authComplete(e) {
        if(e.data === "auth_complete") {
            this._onAuthComplete()
            this.authWindow.close()
            
            window.removeEventListener("message", this.authComplete.bind(this));
        }
    }
}