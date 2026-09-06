/* eslint-disable no-undef */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { JobsCollection } from './jobs';
import './methods';

if (Meteor.isServer) {
  describe('jobs methods', function () {
    const insertJob = (userId, overrides = {}) => Meteor.server.method_handlers['jobs.insert'].apply(
      { userId },
      [{
        company: 'Acme',
        position: 'Engineer',
        status: 'Applied',
        appliedDate: new Date(),
        ...overrides,
      }],
    );

    const updateJob = (userId, jobId, overrides = {}) => Meteor.server.method_handlers['jobs.update'].apply(
      { userId },
      [jobId, {
        company: 'Acme Updated',
        position: 'Senior Engineer',
        status: 'Interviewing',
        dateApplied: '2024-01-01',
        ...overrides,
      }],
    );

    const removeJob = (userId, jobId) => Meteor.server.method_handlers['jobs.remove'].apply({ userId }, [jobId]);

    beforeEach(async function () {
      await JobsCollection.removeAsync({});
    });

    describe('jobs.insert', function () {
      it('inserts a job for the logged-in user', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        const job = await JobsCollection.findOneAsync(jobId);
        assert.ok(job);
        assert.strictEqual(job.company, 'Acme');
        assert.strictEqual(job.userId, userId);
      });

      it('throws not-authorized when not logged in', async function () {
        try {
          await insertJob(undefined);
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'not-authorized');
        }
      });

      it('throws invalid-status for an unknown status', async function () {
        const userId = Random.id();
        try {
          await insertJob(userId, { status: 'NotARealStatus' });
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'invalid-status');
        }
      });

      it('throws a validation error when a required field is missing', async function () {
        const userId = Random.id();
        try {
          await insertJob(userId, { company: undefined });
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.include(err.message, 'Match error');
        }
      });

      it('throws a validation error when a field has the wrong type', async function () {
        const userId = Random.id();
        try {
          await insertJob(userId, { appliedDate: '2024-01-01' });
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.include(err.message, 'Match error');
        }
      });

      it('accepts optional url and notes fields', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId, { url: 'https://example.com', notes: 'Referred by a friend' });

        const job = await JobsCollection.findOneAsync(jobId);
        assert.strictEqual(job.url, 'https://example.com');
        assert.strictEqual(job.notes, 'Referred by a friend');
      });
    });

    describe('jobs.update', function () {
      it('updates a job owned by the logged-in user', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        await updateJob(userId, jobId);

        const job = await JobsCollection.findOneAsync(jobId);
        assert.strictEqual(job.company, 'Acme Updated');
        assert.strictEqual(job.status, 'Interviewing');
      });

      it('throws not-authorized when not logged in', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        try {
          await updateJob(undefined, jobId);
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'not-authorized');
        }
      });

      it('throws not-found when the job belongs to another user', async function () {
        const ownerId = Random.id();
        const otherUserId = Random.id();
        const jobId = await insertJob(ownerId);

        try {
          await updateJob(otherUserId, jobId);
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'not-found');
        }
      });

      it('throws invalid-status for an unknown status', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        try {
          await updateJob(userId, jobId, { status: 'NotARealStatus' });
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'invalid-status');
        }
      });

      it('throws a validation error when a required field is missing', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        try {
          await updateJob(userId, jobId, { position: undefined });
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.include(err.message, 'Match error');
        }
      });
    });

    describe('jobs.remove', function () {
      it('removes a job owned by the logged-in user', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        await removeJob(userId, jobId);

        const job = await JobsCollection.findOneAsync(jobId);
        assert.isUndefined(job);
      });

      it('throws not-authorized when not logged in', async function () {
        const userId = Random.id();
        const jobId = await insertJob(userId);

        try {
          await removeJob(undefined, jobId);
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'not-authorized');
        }
      });

      it('throws not-found when the job belongs to another user', async function () {
        const ownerId = Random.id();
        const otherUserId = Random.id();
        const jobId = await insertJob(ownerId);

        try {
          await removeJob(otherUserId, jobId);
          assert.fail('expected an error to be thrown');
        } catch (err) {
          assert.strictEqual(err.error, 'not-found');
        }

        const job = await JobsCollection.findOneAsync(jobId);
        assert.ok(job, 'job should not have been removed');
      });
    });
  });

  describe('jobs publications', function () {
    beforeEach(async function () {
      await JobsCollection.removeAsync({});
    });

    it('only returns jobs owned by the requesting user', async function () {
      const userId = Random.id();
      const otherUserId = Random.id();

      await JobsCollection.insertAsync({ company: 'Mine', position: 'Engineer', status: 'Applied', userId, createdAt: new Date() });
      await JobsCollection.insertAsync({ company: 'Theirs', position: 'Engineer', status: 'Applied', userId: otherUserId, createdAt: new Date() });

      const cursor = JobsCollection.find({ userId });
      const jobs = await cursor.fetchAsync();

      assert.strictEqual(jobs.length, 1);
      assert.strictEqual(jobs[0].company, 'Mine');
    });
  });
}
