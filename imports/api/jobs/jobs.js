import { Mongo } from 'meteor/mongo';

export const JobsCollection = new Mongo.Collection('jobs');

export const JOB_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];
