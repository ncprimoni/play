import { render } from '@stencil/core/testing';
import { AudioPlayer } from './audio-player';

describe('audio-player', () => {
  it('should build', () => {
    expect(new AudioPlayer()).toBeTruthy();
  });

  describe('rendering', () => {
    let element;
    beforeEach(async () => {
      element = await render({
        components: [AudioPlayer],
        html: '<audio-player></audio-player>'
      });
    });

    it('should work without parameters', () => {
      expect(element.textContent).toEqual('Your new audio-player component');
    });
  });
});