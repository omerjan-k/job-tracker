import { Meteor} from 'meteor/meteor';

Meteor.publish('jobs', function() {
  if (!this.userId) {
    return Meteor.users.find(
       { _id: this.userId },
       {fields: { 'profile': 1, 'emails': 1, username: 1 } }
    );
  } else {
    this.ready();
  }
});