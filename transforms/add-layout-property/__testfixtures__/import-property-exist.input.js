import Component from '@ember/component';
import { run } from '@ember/runloop';
import layout from './template';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['__page-layout__page-wrapper'],
  layout: layout,
  classNameBindings: ['sidebarEnabled:sidebar-present'],
  sidebarEnabled: false,
  contentSidebarEnabled: false,

  didRender() {
    this._super(...arguments);
    this.interactivityTracking.trackOnce('FirstWrapperRender');
  },

  actions: {
    showHideSidebar(state) {
      run.next(() => {
        set(this, 'sidebarEnabled', state);
      });
    }
  }
});
