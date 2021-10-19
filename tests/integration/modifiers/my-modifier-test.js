import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

module('Integration | Modifier | my-modifier', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(hooks) {
    this.component = null;

    this.set('getComponentReference', (reference) => {
      this.component = reference;
    });

    class MyContext {
      @tracked a = 1;
    }

    let ctx = new MyContext();
    this.setProperties({ ctx });
  });

  // Replace this with your real tests.
  test('it renders with modifier', async function (assert) {
    class ExampleComponent extends Component {
      constructor() {
        super(...arguments);
        console.log('constructing');
        this.wasInserted = false;
        this.stateChanged = null;
        this.stateValue = null;
        this.inserted = this.inserted.bind(this);
      }

      inserted() {
        console.log('Example Component Inserted');
        this.wasInserted = true;
      }

      @action
      changeState(propName, value) {
        console.log(`changeState called for propName: ${propName} with value: ${value}`);
        this.stateChanged = propName;
        this.stateValue = value;
      }

      get changeArgs() {
        let changeObj = {};
        changeObj['a'] = this.args['a'];
        return changeObj;
      }
    }

    setComponentTemplate(
      hbs`
        <span {{my-modifier this.inserted this.changeState this.changeArgs }}>My Component</span>
      `,
      ExampleComponent
    );

    this.setProperties({ ExampleComponent });

    await render(hbs`
    <this.ExampleComponent @a={{this.ctx.a}}/>`);

    this.ctx.a = 2;
    await settled();

    assert.ok(1);
  });
});
