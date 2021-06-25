injectTableButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: injectTable,
    });
});

function injectTable() {
    let snakeoilMap = {
        "Common": "1,000",
        "Uncommon": "3,500",
        "Rare": "12,500",
        "Classic": "35,000",
        "Sketch": "10,000",
    }

    // debugger;
    function updateListener() {
        const targetNode = document.getElementsByClassName('MobileCardDesign')[0];
        // Options for the observer (which mutations to observe)
        const config = {childList: true};
        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            populatePage()
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    };

    function populatePage() {
        // Iterate through html cards
        const cardList = document.getElementsByClassName("large-card");
        for (let i = 0; i < cardList.length; i++) {
            const card = cardList[i];
            const collection = card.getElementsByClassName('collection')[0].textContent;
            if (collection !== "novarallywax") {
                continue;
            }

            if (typeof (cardList[i].children[0].children[0].children[0]) === "undefined") {
                continue;
            }

            const raw_img_url = cardList[i].children[0].children[0].children[0].children[0].src;
            const raw_price = cardList[i].children[1].children[1].children[1].innerText;
            const clean_price = parseFloat(raw_price.split("WAX")[0]);

            let rarity = "nil";
            switch (raw_img_url) {
                case (raw_img_url.match(/uncommon/) || {}).input:
                    rarity = "Uncommon"
                    break;
                case (raw_img_url.match(/common/) || {}).input:
                    rarity = "Common"
                    break;
                case (raw_img_url.match(/rare/) || {}).input:
                    rarity = "Rare"
                    break;
                case (raw_img_url.match(/classic/) || {}).input:
                    rarity = "Classic"
                    break;
                case (raw_img_url.match(/sketch/) || {}).input:
                    rarity = "Sketch"
                    break;
                default:
                    break;
            }

            let vehicle = false;
            let driver = false;

            switch (raw_img_url) {
                case (raw_img_url.match(/\d+_\S+_\S+/) || {}).input:
                    driver = true;
                    break;
                case (raw_img_url.match(/\/\S+_\S+\.gif/) || {}).input:
                    vehicle = true;
                    break;
                default:
                    break;
            }

            let snakeoil_value = (vehicle || driver) ? snakeoilMap[rarity] : 0;
            if (snakeoil_value === 0) {
                continue;
            }

            const parent = cardList[i].children[0].children[0].children[0];
            const ratioDiv = document.createElement('div');
            parent.appendChild(ratioDiv);
            ratioDiv.innerHTML = (clean_price / (parseFloat(snakeoil_value.toString().replace(',', '')))).toFixed(4) + " : 1";
            ratioDiv.style.position = "absolute";
            ratioDiv.style.margin = "auto";
            ratioDiv.style.left = "0";
            ratioDiv.style.right = "0";
            ratioDiv.style.top = "-18.5px";
            ratioDiv.style.letterSpacing = "2px";
            ratioDiv.style.fontSize = "12px";
            ratioDiv.style.fontWeight = "900";
            ratioDiv.style.color = "#42ba67";
        }
    }

    populatePage();
    updateListener();
}