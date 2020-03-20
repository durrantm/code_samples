describe('Google Search Form', function() {
  beforeEach( function() {
    browser.waitForAngularEnabled(false);
    browser.get('http://google.com/');
  })

  it('should return status code 200 or 301', function() {
    const { httpGet } = require('./code');
    httpGet("http://google.com").then(function(result) {
      const ok = [200,301].includes(result.statusCode)
      expect(ok).toEqual(true);
    });
  });
  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Google');
  });
  it('should have a title', function() {
    expect(browser.getTitle()).not.toEqual('zzzzzz');
  });
  it('should have a form', function() {
    let form = element(by.css('form'));
    expect(form.isDisplayed()).toBe(true);
  });
  it('should have a form and uses $', function() {
    let form = $('form');
    expect(form.isDisplayed()).toBe(true);
  });
  it('should have a form with an input field', function() {
    let input = element.all(by.css('input[name="q"]'));
    expect(input.isDisplayed()).toEqual([true]);
  });
  it('should have a form with an input field and use $', function() {
    let input = $('input[name="q"]');
    expect(input.isDisplayed()).toEqual(true);
  });
  it('should have a form with multiple span fields and use $$', function() {
    let spans = $$('span');
    expect(spans.first().isDisplayed()).toEqual(true);
  });
});

describe('Google search field', function() {
  beforeEach( function() {
    browser.waitForAngularEnabled(false);
    browser.get('http://google.com/');
    input = $('input[name="q"]');
  })
  it('should have a field you can type in', function() {
    input.sendKeys('123');
    expect(input.getAttribute('value')).toEqual('123');
  });
  it('should have a field you can type in and submit', function() {
    const input_on_result_page = $('input[role="combobox"]');
    input.sendKeys('123\n');
    expect(input_on_result_page.getAttribute('value')).toEqual('123');
  });
  pending('FIREFOX ISSUE should have a result page using Key.ENTER', function() {
    browser.get('http://google.com/');
    const input_on_result_page = $('input[name="q"]');
    input.sendKeys('123\n');
    input.sendKeys(protractor.Key.ENTER);
    expect($('body').getText()).toContain('123');
  });
})
