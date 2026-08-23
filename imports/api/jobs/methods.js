import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { JobsCollection, JOB_STATUSES } from './jobs';

Meteor.methods({
  'jobs.insert'(jobData) {
     if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    check(jobData, {
        company: String,
        position: String,
        status: String,
        dateApplied: String,
        url: Match.Optional(String),
        notes: Match.Optional(String),
    });

    if (!JOB_STATUSES.includes(jobData.status)) {
      throw new Meteor.Error('Invalid job status');
    }

    return JobsCollection.insert({
      ...jobData,
      userId: this.userId,
      createdAt: new Date(),
    });
  },

  'jobs.update'(jobId, jobData) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    check(jobId, String);

    const job = JobsCollection.findOne({ _id: jobId, userId: this.userId });
    if (!job) {
      throw new Meteor.Error('Job not found');
    }

    check(jobData, {
        company: String,
        position: String,
        status: String,
        dateApplied: String,
        url: Match.Optional(String),
        notes: Match.Optional(String),
    });

    if (!JOB_STATUSES.includes(jobData.status)) {
      throw new Meteor.Error('Invalid job status');
    }

    return JobsCollection.update(jobId, {
      $set: {
        ...jobData,
        updatedAt: new Date(),
      },
    });
  },

  'jobs.remove'(jobId) {
    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    check(jobId, String);

    const job = JobsCollection.findOne({ _id: jobId, userId: this.userId });
    if (!job) {
      throw new Meteor.Error('Job not found');
    }

    return JobsCollection.remove(jobId);
  },
});