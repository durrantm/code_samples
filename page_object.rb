class PageObject
  def initialize file
    page_objects = YAML.load File.read(file)
    page_objects.each do |key, value|
      self.class.__send__ :define_method, key do value end
    end
  end
end
