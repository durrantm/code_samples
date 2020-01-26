//This is untested code

using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Guru99Demo
{
    class CSS						
    {
        IWebDriver driver;
        [Test]
		public void cssDemo()
        {
            driver = new ChromeDriver("G:\\");
            driver.Url = "http://google.com/";
            driver.Manage().Window.Maximize();
            IWebElement searchField = driver.FindElement(By.CssSelector("input[name='q']"));
            IWebElement submitButton = driver.FindElement(By.CssSelector("input[name='btnK]"));
            IWebElement page = driver.FindElement(By.CssSelector("body")).Text;
            searchField.SendKeys("123");
            submitButton.Click();
	    Assert.That(page).Contains('123')
        }
    }
}
