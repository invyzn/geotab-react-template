class ToggleHandler{
    /**
     * Toggles the development addin
     * allows user to see any processes that take place when the addin is blurred/focused
     */
    constructor(){
        this.focus = true;
        let displayToggle = document.getElementById('toggleBtn');
        displayToggle.addEventListener('click', () => {
            if(this.focus){
                displayToggle.innerHTML = 'Focus add-in';
                let addin = global.geotab.addin[Object.keys(global.geotab.addin)[0]];
                addin.blur();
            } else {
                let addin = global.geotab.addin[Object.keys(global.geotab.addin)[0]];
                displayToggle.innerHTML = 'Blur add-in';
                addin.focus(global.api, global.state);
            }
            this.focus = !this.focus;
        });
    }

}

new ToggleHandler();