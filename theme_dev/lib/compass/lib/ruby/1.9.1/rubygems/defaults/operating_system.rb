# :DK-BEG: override 'gem install' to enable RubyInstaller DevKit usage
Gem.pre_install do |gem_installer|
  unless gem_installer.spec.extensions.empty?
    unless ENV['PATH'].include?('c:\\Ruby192\\DevKit\\mingw\\bin') then
      Gem.ui.say 'Temporarily enhancing PATH to include DevKit...' if Gem.configuration.verbose
      ENV['PATH'] = 'c:\\Ruby192\\DevKit\\bin;c:\\Ruby192\\DevKit\\mingw\\bin;' + ENV['PATH']
    end
    ENV['RI_DEVKIT'] = 'c:\\Ruby192\\DevKit'
    ENV['CC'] = 'gcc'
    ENV['CPP'] = 'cpp'
    ENV['CXX'] = 'g++'
  end
end
# :DK-END:
