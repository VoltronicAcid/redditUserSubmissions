// ==UserScript==
// @name          Reddit User Submissions
// @description   Make the submissions tab the default view when viewing a user's page on Reddit
// @author        VoltronicAcid
// @version       0.0.1
// @icon          https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @match         https://*reddit.com/user/*
// ==/UserScript==

(() => {
    "use strict";

    const settingsKey = "userSubmissions.lastVisited";
    const [_, username, section] = document.location.pathname
        .split("/")
        .filter(str => str.length);

    const userLastVisited = JSON.parse(localStorage.getItem(settingsKey)) ?? {};

    if (!section) {
        const lastVisited = userLastVisited[username];

        if (!lastVisited || new Date().getTime() - lastVisited > 1000 * 60 * 60) {
            userLastVisited[username] = new Date().getTime();
            localStorage.setItem(settingsKey, JSON.stringify(userLastVisited));

            document.location = document.location + "/submitted/";
        }
    }
})();
