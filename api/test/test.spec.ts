import * as server from '../app';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test function', () => {
  it('should return hello world', () => {
    const result = 'Hello world!';
    expect(result).to.equal('Hello world!');
  });

});