chrome.storage.local.get('enabled', function(result) {
    let isEnabled = !!result ? !!result.enabled : true;
    runScripts(isEnabled);
});

chrome.storage.onChanged.addListener((changes) => {
    runScripts(changes.enabled.newValue);
})

function runScripts(takeThemAway) {
    const dataAttributesToRemove = [
        '[data-attrid="kc:/film/film:reviews"]', 
        '[data-attrid="kc:/ugc:thumbs_up"]', 
        '[data-attrid="kc:/film/film:critic_reviews"]',
        '[data-attrid="kc:/cvg/computer_videogame:reviews"]',
        '[data-attrid="kc:/ugc:user_reviews"]',
        '[data-attrid="kc:/tv/tv_program:reviews"]',
        '[data-starbar-class="rating-list"]'
        
    ];
    
    for(let item of dataAttributesToRemove) {
        let elem = document.querySelector(item);
        
        if(elem) {
            elem.style.display = takeThemAway ? 'none' : 'block';
        }
    }
    
    if(window.location.host === 'www.google.com') {
        const titleStars = document.getElementsByClassName('slp f');

        for(let title of titleStars) {
            if(title.firstElementChild && title.firstElementChild.nodeName === 'G-REVIEW-STARS') {
                    title.style.display = takeThemAway ? 'none' : 'block';
            }
        }
    
    } else if(window.location.host === 'www.imdb.com') {
        const classNamesToRemove = ['titleReviewBar', 'ratings_wrapper']
        
        for(let className of classNamesToRemove) {
            let elems = document.getElementsByClassName(className);
            
            if(elems.length) {
                for(let elem of elems) {
                    elem.style.display = takeThemAway ? 'none' : 'block';
                }
            }
        }
        
        const idsToRemove = ['titleUserReviewsTeaser','ratingWidget']
        
        for(let id of idsToRemove) {
            let elem = document.getElementById(id);
            if (elem && elem.parentNode) {
                elem.style.display = takeThemAway ? 'none' : 'block';
            }
        }
    }
}