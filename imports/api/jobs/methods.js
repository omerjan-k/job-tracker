import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { JobsCollection, JOB_STATUSES } from './jobs';

Meteor.methods({
  async 'jobs.insert'(jobData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to add a job.');
    }

    check(jobData, {
      company: String,
      position: String,
      status: String,
      appliedDate: Date,
      url: Match.Optional(String),
      notes: Match.Optional(String),
    });

    if (!JOB_STATUSES.includes(jobData.status)) {
      throw new Meteor.Error('invalid-status', 'The provided job status is not valid.');
    }

    return JobsCollection.insertAsync({
      ...jobData,
      userId: this.userId,
      createdAt: new Date(),
    });
  },

  async 'jobs.update'(jobId, jobData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update a job.');
    }

    check(jobId, String);

    const job = JobsCollection.findOneAsync({ _id: jobId, userId: this.userId });
    if (!job) {
      throw new Meteor.Error('not-found', 'Job not found or you do not have permission to edit it.');
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
      throw new Meteor.Error('invalid-status', 'The provided job status is not valid.');
    }

    return JobsCollection.updateAsync(jobId, {
      $set: {
        ...jobData,
        updatedAt: new Date(),
      },
    });
  },

  async 'jobs.remove'(jobId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to delete a job.');
    }

    check(jobId, String);

    const job = JobsCollection.findOneAsync({ _id: jobId, userId: this.userId });
    if (!job) {
      throw new Meteor.Error('not-found', 'Job not found or you do not have permission to delete it.');
    }

    return JobsCollection.removeAsync(jobId);
  },
});