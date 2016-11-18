'use strict';

const mentionedPeopleImagesParser = require('./images'),
    mentionedPeopleArticlesParser = require('./articles');

function getNameInitials(prefLabel) {
    const initials = prefLabel.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function getAbbreviatedName(prefLabel) {
    const prefLabelArray = prefLabel.split(' '),
        max = prefLabelArray.length;
    return prefLabelArray[0] + ' ' + prefLabelArray[max - 1];
}

class MentionedPeopleParser {

    handle(people, articlesCallback) {

        people.map(person => {
            person.abbrName = getAbbreviatedName(person.prefLabel);
            return person;
        });

        people.map(person => {
            person.initials = getNameInitials(person.prefLabel);
            return person;
        });

        mentionedPeopleImagesParser.handle(people);

        mentionedPeopleArticlesParser.handle(people, articlesCallback);
    }
}

module.exports = new MentionedPeopleParser();
