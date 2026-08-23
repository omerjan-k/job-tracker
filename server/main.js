import { Meteor } from 'meteor/meteor';
import './publications';
import 'imports/api/jobs/methods';
import 'imports/api/jobs/server/publications';


Meteor.startup(async () => {
  console.log('Server started'); // eslint-disable-line no-console

});
