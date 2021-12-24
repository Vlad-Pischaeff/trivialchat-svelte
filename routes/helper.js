// const emitter = require('./service');
const User = require('../models/User');

let countedSites = {}, countedEmails = {};

exports.getUsers = async () => {
  try {
    const users = await User.find({});
    countedSites = users.reduce((allNames, name) => {     // CountedSites = { site: email }
      allNames[name.site] = name.email;
      return allNames;
    }, {});
    countedEmails = users.reduce((allNames, name) => {    // CountedEmails = { email: site }
      allNames[name.email] = name.site;
      return allNames;
    }, {});
    console.log('emitter on GET USERS ...\n', 'countedSites...\t \n', countedSites, '\n countedEmails...\t', countedEmails);
  } catch(e) {
    console.log('getUsers error ...', e);
  }
}

// emitter.on('get users', getUsers);

exports.Sites = function() {
  return countedSites;
};

exports.Emails = function(name) {
  return countedEmails;
};
