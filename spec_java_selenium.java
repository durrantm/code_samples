package newproject;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
//comment the above line and uncomment below line to use Firefox
//import org.openqa.selenium.firefox.FirefoxDriver;
public class PG1 {
    public static void main(String[] args) {
      //System.setProperty("webdriver.gecko.driver","/usr/bin/geckodriver.exe");
  //WebDriver driver = new FirefoxDriver();
  //uncomment the above 2 lines and comment below 2 lines to use Chrome
  System.setProperty("webdriver.chrome.driver","/user/bin/chromedriver.exe");
  WebDriver driver = new ChromeDriver();
        String baseUrl = "http://google.com";
        String expectedTitle = "Google";
        String actualTitle = "";
        driver.get(baseUrl);
        actualTitle = driver.getTitle();
        if (actualTitle.contentEquals(expectedTitle)){
            System.out.println("Test Passed!");
        } else {
            System.out.println("Test Failed");
        }
        driver.close();
    }
}
