import { Meteor } from 'meteor/meteor';
import { JobsCollection } from '../jobs';

Meteor.publish('jobs.myJobs', function () {
  if (!this.userId) {
    return this.ready();
  }
  return JobsCollection.find({ userId: this.userId });
});