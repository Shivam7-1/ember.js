import Controller from '@ember/controller';
import { moduleFor, ApplicationTestCase, runTask, testUnless } from 'internal-test-helpers';
import { Component } from '@ember/-internals/glimmer';
import { DEPRECATIONS } from '@ember/-internals/deprecations';

/*
 In Ember 1.x, controllers subtly affect things like template scope
 and action targets in exciting and often inscrutable ways. This test
 file contains integration tests that verify the correct behavior of
 the many parts of the system that change and rely upon controller scope,
 from the runtime up to the templating layer.
*/

moduleFor(
  'Template scoping examples',
  class extends ApplicationTestCase {
    [`${testUnless(
      DEPRECATIONS.DEPRECATE_TEMPLATE_ACTION.isRemoved
    )} Actions inside an outlet go to the associated controller`](assert) {
      expectDeprecation(
        /Usage of the `\(action\)` helper is deprecated./,
        DEPRECATIONS.DEPRECATE_TEMPLATE_ACTION.isEnabled
      );
      this.add(
        'controller:index',
        Controller.extend({
          actions: {
            componentAction() {
              assert.ok(true, 'controller received the action');
            },
          },
        })
      );

      this.addComponent('component-with-action', {
        ComponentClass: Component.extend({
          classNames: ['component-with-action'],
          click() {
            this.action();
          },
        }),
      });

      this.addTemplate('index', '{{component-with-action action=(action "componentAction")}}');

      return this.visit('/').then(() => {
        runTask(() => this.$('.component-with-action').click());
      });
    }
  }
);
