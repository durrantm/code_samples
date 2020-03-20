'use strict';
const { expect } = require('chai');
const Resort = require('./index').resort;
const SkiTrip = require ('./index').skiTrip;
const Visit = require ('./index').visit;
let resort1, resort2, resort3;
let skiTrip, firstVisit;
let tahoe, heavenly, sierra;

describe('For all Ski Trips (using before statements)', function() {
  before(function() {
    resort1 = new Resort('Tahoe');
    resort2 = new Resort('Heavenly');
    //resort3 = new Resort('Sierra At Tahoe');
  });
  beforeEach(function() {
    skiTrip = new SkiTrip;
  });
  it('a resort exists', function() {
    expect(resort1.name).to.equal('Tahoe');
  });
  it('a Ski Trip exists with no no visits', function() {
    expect(skiTrip.visits).to.eql([]);
  });
  it('I can visit a Resort on a trip', function() {
    const visit = new Visit(resort1, '01/01/2000');
    skiTrip.visits.push(visit);
    expect(skiTrip.visits).to.eql([visit]);
  });
  describe('Tests for visits to multiple resorts', function () {
    beforeEach(function () {
      tahoe = new Visit(resort1, '01/01/2000');
      heavenly = new Visit(resort2, '01/01/2000');
      skiTrip.visits.push(tahoe, heavenly);
      firstVisit = skiTrip.visits[0];
      firstVisit.next = heavenly;
      sierra = new Visit(resort3, '01/01/2000');
    });
    it('I can visit two specific resorts on a trip', function() {
      expect(skiTrip.visits.length).to.equal(2);
      expect(firstVisit.resort.name).to.equal('Tahoe');
      expect(firstVisit.date).to.equal('01/01/2000');
    });
    it('I know which resort is next after the first one', function() {
      expect(firstVisit.next.resort.name).to.equal('Heavenly');
    });
    it('I can remove the middle of three visits from the ski trip', function() {
      skiTrip.visits.push(sierra);
      skiTrip.visits[1].next = sierra;
      skiTrip.removeVisit(1);
      expect(skiTrip.visits).to.eql([tahoe, sierra]);
      expect(firstVisit.next).to.equal(sierra);
    });
  });
});