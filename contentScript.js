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

const HTMLElementsToRemove = ['g-review-stars'];

for(let item of HTMLElementsToRemove) {
    let elems = document.getElementsByTagName(item);

    if(elems.length) {
        for(let elem of elems) {
            elem.parentElement.parentElement.removeChild(elem.parentElement);
        }
    }
}

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
    elem.parentNode.removeChild(elem);
}