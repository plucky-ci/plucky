const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const projectService = require('../src/services/projectService');
const {ConfigLoader} = require('plucky-loader');

const noop = ()=>{};

describe('projectService', ()=>{
  it('should run getProjects', function(done) {
      projectService.getProjects().then((result) => {
        result.forEach((res) => {
          expect(res).to.be.an.instanceof(ConfigLoader);
        });
        done();
      });
  });
});
