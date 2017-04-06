const assert = require('assert');
const sinon = require('sinon');
const isPng = require('is-png');

const badge = require('../lib/badge');
const svg2img = require('../lib/svg-to-img.js');

describe('The rasterizer', function () {
  let cacheGet;
  beforeEach(function () { cacheGet = sinon.spy(svg2img._imgCache, 'get'); });
  afterEach(function () { cacheGet.restore(); });

  it('should produce PNG', function(done) {
    badge({ text: ['cactus', 'grown'], format: 'svg' }, svg => {
      svg2img(svg, 'png', data => {
        assert.ok(isPng(data));
        done();
      });
    });
  });

  it('should cache its results', function(done) {
    badge({ text: ['will-this', 'be-cached?'], format: 'svg' }, svg => {
      svg2img(svg, 'png', data1 => {
        assert.ok(isPng(data1));
        assert.equal(cacheGet.called, false);

        svg2img(svg, 'png', data2 => {
          assert.ok(isPng(data2));
          assert.ok(cacheGet.calledOnce);

          done();
        });
      });
    });
  });
});
