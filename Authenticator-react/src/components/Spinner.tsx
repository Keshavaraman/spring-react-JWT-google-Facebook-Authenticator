import React from 'react';

export const spinnerService = {
    showSpinner : () => {
        const Loader = '<div class="backdrop" id="spinner"><div class="Load"><div class="loader">Loading...</div><div className="backdrop_1"></div></div></div>';
        const Spin = document.getElementById('spinner');
        if(Spin === null || Spin.parentNode === null)
        document.body.insertAdjacentHTML('beforeend', Loader);
    },
    hideSpinner : () => {
        const Spin = document.getElementById('spinner');
        if(Spin !== null && Spin.parentNode !== null) {
            // @ts-ignore
            Spin.parentNode.removeChild(Spin);
        }
    }
};
