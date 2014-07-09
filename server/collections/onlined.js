/*
 * Add query methods like this:
 *  Onlined.findPublic = function () {
 *    return Onlined.find({is_public: true});
 *  }
 */


Onlined.allow({
  insert: function (userId, doc) {
    return userId;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return doc.user_id === userId;
  },

  remove: function (userId, doc) {
    return doc.user_id === userId;
  }
});

Onlined.deny({
  insert: function (userId, doc) {
    return false;
  },

  update: function (userId, doc, fieldNames, modifier) {
    return false;
  },

  remove: function (userId, doc) {
    return false;
  }
});
