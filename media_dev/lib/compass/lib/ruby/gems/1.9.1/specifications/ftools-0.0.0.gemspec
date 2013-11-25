# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = %q{ftools}
  s.version = "0.0.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Kasper Johansen"]
  s.date = %q{2012-09-04}
  s.description = %q{Various file-tools for Ruby, that I want to share with others}
  s.email = %q{k@spernj.org}
  s.extra_rdoc_files = ["LICENSE.txt", "README.rdoc"]
  s.files = [".document", ".rspec", "Gemfile", "Gemfile.lock", "LICENSE.txt", "README.rdoc", "Rakefile", "VERSION", "ftools.gemspec", "lib/ftools.rb", "spec/ftools_spec.rb", "spec/spec_helper.rb"]
  s.homepage = %q{http://github.com/kaspernj/ftools}
  s.licenses = ["MIT"]
  s.require_paths = ["lib"]
  s.rubygems_version = %q{1.3.7}
  s.summary = %q{Various file-tools for Ruby, that I want to share with others}

  if s.respond_to? :specification_version then
    current_version = Gem::Specification::CURRENT_SPECIFICATION_VERSION
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<rspec>, ["~> 2.8.0"])
      s.add_development_dependency(%q<rdoc>, ["~> 3.12"])
      s.add_development_dependency(%q<bundler>, [">= 1.0.0"])
      s.add_development_dependency(%q<jeweler>, ["~> 1.8.4"])
    else
      s.add_dependency(%q<rspec>, ["~> 2.8.0"])
      s.add_dependency(%q<rdoc>, ["~> 3.12"])
      s.add_dependency(%q<bundler>, [">= 1.0.0"])
      s.add_dependency(%q<jeweler>, ["~> 1.8.4"])
    end
  else
    s.add_dependency(%q<rspec>, ["~> 2.8.0"])
    s.add_dependency(%q<rdoc>, ["~> 3.12"])
    s.add_dependency(%q<bundler>, [">= 1.0.0"])
    s.add_dependency(%q<jeweler>, ["~> 1.8.4"])
  end
end
