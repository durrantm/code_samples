const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
let tags = require('./protractor-mocha-tags')();

describe('DefaultTest #chrome #firefox', () => {

  before('Not using Angular in this spec', () => {
    browser.waitForAngularEnabled(false);
    input_field = $('input[name="q"]');
    p = {
      form: element(by.css('form')),
      input_field: $('input[name="q"]')
    }
  })

  it('should go to google and check the input field text', () => {
    browser.get('https://www.google.com');
    input_field.sendKeys('123');
    const input_value = input_field.getAttribute('value');
    expect(input_value).to.eventually.equal('123');
  });
});

describe('Google Search Form #chrome #firefox', () => {
  before('Visit Page and verify elements without reloading', () => {
    browser.get('http://google.com/');
    form = element(by.css('form'));
    input_field_$ = $('form input[name="q"]');
    multiple_fields = $$('span');
    valid_status_codes = [200,301]
  })
  it('should return status code 200 or 301', () => {
    const { httpGet } = require('./code');
    httpGet("http://google.com").then(function(result) {
      const status_code_ok = valid_status_codes.includes(result.statusCode)
      expect(status_code_ok).to.equal(true);
    });
  });
  describe('Once we know the page loads OK', () => {
    it('should have a title', () => {
      expect(browser.getTitle()).to.eventually.equal('Google');
    });
    it('should have a title', () => {
      expect(browser.getTitle()).not.to.eventually.equal('zzzzzz');
    });
    it('should have a form', () => {
      expect(p.form).to.exist;
    });
    it('should have a form and use $', () => {
      expect(form).to.exist;
    });
    it('should have a form with an input field', () => {
      expect(input_field).to.exist;
    });
    it('should have a form with an input field and use $', () => {
      let input = $('input[name="q"]');
      expect(input_field_$).to.exist;
    });
    it('should have a form with multiple span fields and use $$', () => {
      expect(multiple_fields).to.exist;
    });
  });
});
describe('Google search field', function() {
  beforeEach( () => {
    browser.waitForAngularEnabled(false);
    browser.get('http://google.com/');
    input = $('input[name="q"]');
  })
  it('should have a field you can type in #chrome #firefox', () => {
    input.sendKeys('123');
    input.sendKeys(protractor.Key.TAB);
    expect(input.getAttribute('value')).to.eventually.equal('123');
  });
  it('should have a field you can type in and submit #chrome #firefox', () => {
    const input_on_result_page = $('input[role="combobox"]');
    input.sendKeys('123\n');
    expect(input_on_result_page.getAttribute('value')).to.eventually.equal('123');
  });
  it('FIREFOX ONLY ISSUE should have a result page using Key.ENTER #firefox', () => {
    browser.get('http://google.com/');
    input.sendKeys('123', protractor.Key.ENTER);
    const page = $('body').getText();
    expect(page).to.eventually.contain('123');
  });
});
