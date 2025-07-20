// ==UserScript==
// @name          Reddit User Submissions
// @description   Make the submissions tab the default view when viewing a user's page on Reddit
// @author        VoltronicAcid
// @version       0.0.3
// @icon          https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @match         https://*reddit.com/user/*
// ==/UserScript==

(() => {
    "use strict";

    const settingsKey = "userSubmissions.lastVisited";
    const [_, username, section] = document.location.pathname
        .split("/")
        .filter(str => str.length);
    const userLinks = document.querySelectorAll("span.user > a");

    if (userLinks.length === 1) {
        const me = userLinks[0].href
            .split("/")
            .filter(str => str.length)
            .at(-1);

        if (username === me) return;
    }

    const userLastVisited = JSON.parse(localStorage.getItem(settingsKey)) ?? {};
    const cachedUsernames = Object.keys(userLastVisited);
    const userCacheSizeLimit = 250;

    if (!section) {
        const lastVisited = userLastVisited[username];

        if (!lastVisited || new Date().getTime() - lastVisited > 1000 * 60 * 60) {
            userLastVisited[username] = new Date().getTime();
            localStorage.setItem(settingsKey, JSON.stringify(userLastVisited));

            document.location = document.location + "/submitted/";
        }
    } else if (cachedUsernames.length > userCacheSizeLimit) {
        cachedUsernames
            .sort((a, b) => userLastVisited[b] - userLastVisited[a])
            .slice(userCacheSizeLimit)
            .forEach(name => delete userLastVisited[name]);

        localStorage.setItem(settingsKey, JSON.stringify(userLastVisited));
    }
})();
