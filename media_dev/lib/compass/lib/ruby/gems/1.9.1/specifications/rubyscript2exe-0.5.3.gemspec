# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{rubyscript2exe}
  s.version = "0.5.3"

  s.required_rubygems_version = nil if s.respond_to? :required_rubygems_version=
  s.cert_chain = nil
  s.date = %q{2007-05-30}
  s.default_executable = %q{rubyscript2exe}
  s.executables = ["rubyscript2exe"]
  s.files = ["SUMMARY", "VERSION", "README", "bin", "bin/rubyscript2exe", "lib", "lib/rubyscript2exe.rb", "realstuff.rb"]
  s.require_paths = ["lib"]
  s.required_ruby_version = Gem::Requirement.new("> 0.0.0")
  s.rubygems_version = %q{1.3.7}
  s.summary = %q{A Ruby Compiler}

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 1

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
    else
    end
  else
  end
end
