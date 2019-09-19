const dataAttributesToRemove = [
    '[data-attrid="kc:/film/film:reviews"]', 
    '[data-attrid="kc:/ugc:thumbs_up"]', 
    '[data-attrid="kc:/film/film:critic_reviews"]',
    '[data-attrid="kc:/ugc:user_reviews"]',
    '[data-starbar-class="rating-list"]'
];

for(let item of dataAttributesToRemove) {
    let elem = document.querySelector(item);
    
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
}

if(window.location.host === 'www.google.com') {
    const titleStars = document.getElementsByClassName('slp f');
    
    while(titleStars.length) {
        let title = titleStars.item(0);
        if(title.firstElementChild.nodeName === 'G-REVIEW-STARS') {
            title.parentNode.removeChild(title);
        }
    }

} else if(window.location.host === 'www.imdb.com') {
    const classNamesToRemove = ['titleReviewBar', 'ratings_wrapper']
    
    for(let className of classNamesToRemove) {
        let elems = document.getElementsByClassName(className);
        
        if(elems.length) {
            for(let elem of elems) {
                elem.parentNode.removeChild(elem);
            }
        }
    }
    
    const idsToRemove = ['titleUserReviewsTeaser','ratingWidget']
    
    for(let id of idsToRemove) {
        let elem = document.getElementById(id);
        if (elem && elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    }
}